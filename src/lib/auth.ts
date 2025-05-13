/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { createClient } from "~/utils/supabase/component"
import { db } from "~/server/db"

type ContextType = GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse }

export async function getUser(context: ContextType) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return { user: null, session: null }
  }

  // Get the user profile from Prisma
  const profile = await db.profile.findUnique({
    where: { id: session.user.id },
  })

  return {
    user: session.user,
    profile,
    session,
  }
}

export async function requireAuth(context: GetServerSidePropsContext) {
  const { user, profile, session } = await getUser(context)

  if (!user || !session) {
    return {
      redirect: {
        destination: `/signin?next=${encodeURIComponent(context.resolvedUrl)}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      user,
      profile,
      session: {
        ...session,
        // Remove non-serializable parts of the session
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at,
      },
    },
  }
}

export async function requireNoAuth(context: GetServerSidePropsContext) {
  const { user, session } = await getUser(context)

  if (user && session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

// export async function requireAdmin(context: GetServerSidePropsContext) {
//   const { user, profile, session } = await getUser(context)

//   if (!user || !session) {
//     return {
//       redirect: {
//         destination: `/signin?next=${encodeURIComponent(context.resolvedUrl)}`,
//         permanent: false,
//       },
//     }
//   }

//   if (profile?.role !== "ADMIN") {
//     return {
//       redirect: {
//         destination: "/dashboard",
//         permanent: false,
//       },
//     }
//   }

  // return {
  //   props: {
  //     user,
  //     profile,
  //     session: {
  //       ...session,
  //       accessToken: session.access_token,
  //       refreshToken: session.refresh_token,
  //       expiresAt: session.expires_at,
  //     },
  //   },
  // }


