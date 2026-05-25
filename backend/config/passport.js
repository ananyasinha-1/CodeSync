import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    let user = await User.findOne({ email });

    if (!user) {
      const baseUsername = profile.displayName.replace(/\s+/g, '_').toLowerCase();
      const username = `${baseUsername}_${Date.now().toString().slice(-4)}`;

      user = await User.create({
        username,
        email,
        googleId: profile.id,
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

export default passport;