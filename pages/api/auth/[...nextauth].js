import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
//import { refreshAccessToken } from "spotify-web-api-node/src/server-methods";
import spotifyApi, {LOGIN_URL} from "../../../lib/spotify";

async function refreshAccessToken(token){
  try{
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    
    const {body:refreshedToken} = await spotifyApi.refreshAccessToken();
    console.log("Refreshed Token:", refreshedToken);
     return{
       ...token,
      accessToken:refreshedToken.access_token,
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, // 1hr as 3600 returns from spotify 
      refreshToken:refreshedToken.refresh_token ?? token.refreshToken,
     };

  }catch (error){
    console.error(error);
    return{
      ...token,
      error: "refreshAccessTokenError",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,

    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages:{
      signIn:'/login',
  },
  callbacks: {
      async jwt({token, account, user}){
          //initial signin 
         if (account && user){
            return{
                ...token,
                accessToken: account.access_Token,
                refreshToken: account.refresh_Token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at * 1000,// in milliseconds
               

            }
         }
         //return previous token if access not expired
         if (Date.now() < token.accessTokenExpires){
             console.log("Existing token is valid");
             return token;
         }
         //refresh if access expired
         console.log("Token expired, refresh!")
         return await refreshAccessToken(token);

      },
      async session({session,token}){
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;

        return session;

      }
  },
});