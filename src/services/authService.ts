import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import bcrypt from 'bcryptjs';

export const authenticateUser = async (email: string, password: string) => {
  try {
    // Try Firebase authentication first
    const auth = getAuth();
    const firebaseResult = await signInWithEmailAndPassword(auth, email, password);
    
    // If Firebase auth succeeds, update backend password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update password in backend
    await fetch("http://localhost:8000/registration/update-credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ 
        email,
        password: hashedPassword,
        firebaseUid: firebaseResult.user.uid 
      })
    });

    // Then proceed with normal login
    const loginResponse = await fetch("http://localhost:8000/registration/adminlogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    return await loginResponse.json();
  } catch (error: any) {
    // If Firebase auth fails, try regular login
    const response = await fetch("http://localhost:8000/registration/adminlogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  }
};