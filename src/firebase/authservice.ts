import { auth } from './config';
import { 
    sendPasswordResetEmail, 
    confirmPasswordReset,
    applyActionCode,
    signInWithEmailAndPassword
} from 'firebase/auth';

export const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email, {
            url: 'http://localhost:5173/reset-password',
            handleCodeInApp: true
        });
        return { success: true };
    } catch (error: any) {
        console.error('Password reset error:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
};

export const handlePasswordReset = async (oobCode: string, newPassword: string, email: string) => {
    try {
        // First reset the password
        await confirmPasswordReset(auth, oobCode, newPassword);
        
        // Then try to sign in with new password
        const userCredential = await signInWithEmailAndPassword(auth, email, newPassword);
        
        // Update backend database
        const response = await fetch("http://localhost:8000/registration/update-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password: newPassword,
                firebaseUid: userCredential.user.uid
            })
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error('Failed to update password in database');
        }

        return { success: true };
    } catch (error: any) {
        console.error('Reset confirmation error:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
};

export const verifyPasswordResetCode = async (code: string) => {
    try {
        await applyActionCode(auth, code);
        return { success: true };
    } catch (error: any) {
        console.error('Code verification error:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
};