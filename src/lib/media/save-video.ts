import {useCallback} from 'react'
import {
  cacheDirectory,
  createDownloadResumable,
  moveAsync,
} from 'expo-file-system/legacy'
import * as MediaLibrary from 'expo-media-library'
import uuid from 'react-native-uuid'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'

import {logger} from '#/logger'
import {IS_ANDROID, IS_NATIVE} from '#/env'
import * as Toast from '#/components/Toast'

const ALBUM_NAME = 'Bluesky'

/**
 * Download a video blob and save it to the device media library.
 *
 * `blobUrl` should be a direct HTTP URL to the video (MP4). For bsky posts
 * this is built from the PDS sync endpoint: the `did` and `cid` come from
 * the post author DID and the `cid` field of `AppBskyEmbedVideo.View`.
 *
 * TODO: support federated PDSes (currently defaults to bsky.social).
 */
async function saveVideoToMediaLibrary(blobUrl: string) {
  const destName = String(uuid.v4())
  const tempPath = `${cacheDirectory ?? ''}/${destName}.bin`

  const dl = createDownloadResumable(blobUrl, tempPath, {cache: false})
  let timedOut = false
  const to = setTimeout(() => {
    timedOut = true
    void dl.cancelAsync()
  }, 60e3)

  const dlRes = await dl.downloadAsync()
  clearTimeout(to)

  if (!dlRes?.uri) {
    throw new Error(
      timedOut ? 'Download timed out' : 'Download failed: no URI returned',
    )
  }

  const finalPath = `${cacheDirectory ?? ''}/${destName}.mp4`
  await moveAsync({from: dlRes.uri, to: finalPath})

  try {
    if (IS_ANDROID) {
      const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME)
      if (album) {
        try {
          await MediaLibrary.createAssetAsync(finalPath, album)
        } catch {
          await MediaLibrary.createAlbumAsync(
            ALBUM_NAME,
            undefined,
            undefined,
            finalPath,
          )
        }
      } else {
        await MediaLibrary.createAlbumAsync(
          ALBUM_NAME,
          undefined,
          undefined,
          finalPath,
        )
      }
    } else {
      await MediaLibrary.saveToLibraryAsync(finalPath)
    }
  } catch (err) {
    logger.error(err instanceof Error ? err : String(err), {
      message: 'Failed to save video to media library',
    })
    throw err
  }
}

export function useSaveVideoToMediaLibrary() {
  const {_} = useLingui()
  const [permissionResponse, requestPermission, getPermission] =
    MediaLibrary.usePermissions({
      granularPermissions: ['video'],
    })

  return useCallback(
    async ({did, cid}: {did: string; cid: string}) => {
      if (!IS_NATIVE) {
        throw new Error('useSaveVideoToMediaLibrary is native only')
      }

      // Construct blob URL via PDS sync endpoint.
      // Falls back to bsky.social for federated users; good enough for v1.
      const blobUrl = `https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${encodeURIComponent(did)}&cid=${encodeURIComponent(cid)}`

      async function save() {
        try {
          await saveVideoToMediaLibrary(blobUrl)
          Toast.show(_(msg`Video saved`))
        } catch (e: unknown) {
          Toast.show(_(msg`Failed to save video: ${String(e)}`), {
            type: 'error',
          })
        }
      }

      const permission = permissionResponse ?? (await getPermission())

      if (permission.granted) {
        await save()
      } else if (permission.canAskAgain) {
        const asked = await requestPermission()
        if (asked.granted) {
          await save()
        } else {
          Toast.show(
            _(
              msg`Videos cannot be saved unless permission is granted to access your media library.`,
            ),
            {type: 'error'},
          )
        }
      } else {
        Toast.show(
          _(
            msg`Permission to access your media library was denied. Please enable it in your system settings.`,
          ),
          {type: 'error'},
        )
      }
    },
    [permissionResponse, requestPermission, getPermission, _],
  )
}
