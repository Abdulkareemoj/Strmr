'use server'

import { auth } from '~/server/auth'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth-schema'
import { video } from '~/server/db/schema/video-schema'
import { short } from '~/server/db/schema/short-schema'
import { music } from '~/server/db/schema/music-schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getVideos() {
  const userId = await getUserId()
  return db
    .select()
    .from(video)
    .where(eq(video.userId, userId))
    .orderBy(video.createdAt)
}

export async function getPublicVideos() {
  return db
    .select()
    .from(video)
    .where(eq(video.isPublic, true))
    .orderBy(video.views)
}

export async function deleteVideo(id: string) {
  const userId = await getUserId()
  await db.delete(video).where(and(eq(video.id, id), eq(video.userId, userId)))
}

export async function updateVideo(
  id: string,
  data: { title?: string; description?: string; isPublic?: boolean }
) {
  const userId = await getUserId()
  return db
    .update(video)
    .set(data)
    .where(and(eq(video.id, id), eq(video.userId, userId)))
}

export async function getShorts() {
  const userId = await getUserId()
  return db
    .select()
    .from(short)
    .where(eq(short.userId, userId))
}

export async function getPublicShorts() {
  return db
    .select()
    .from(short)
    .where(eq(short.isPublic, true))
    .orderBy(short.views)
}

export async function getMusic() {
  const userId = await getUserId()
  return db
    .select()
    .from(music)
    .where(eq(music.userId, userId))
}

export async function getPublicMusic() {
  return db
    .select()
    .from(music)
    .where(eq(music.isPublic, true))
    .orderBy(music.views)
}

export async function getUserProfile(userId: string) {
  return db.select().from(user).where(eq(user.id, userId))
}

export async function updateProfile(data: {
  name?: string
  image?: string
}) {
  const userId = await getUserId()
  return db
    .update(user)
    .set(data)
    .where(eq(user.id, userId))
}
