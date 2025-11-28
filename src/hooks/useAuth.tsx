import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string, username: string, isDriver?: boolean) => Promise<{ error: any }>;
  signIn: (emailOrUsername: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  isPasswordRecovery: boolean;
  loading: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, 'Session:', session);
        if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery mode activated');
          setIsPasswordRecovery(true);
        }
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role when session changes
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data) {
      setUserRole(data.role);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, username: string, isDriver: boolean = false) => {
    // Check if username already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (profileError) {
      toast({
        title: "Signup Error",
        description: "Error checking username availability",
        variant: "destructive"
      });
      return { error: { message: "Error checking username availability" } };
    }

    if (existingProfile) {
      toast({
        title: "Signup Error",
        description: "Username already taken",
        variant: "destructive"
      });
      return { error: { message: "Username already taken" } };
    }

    const redirectUrl = `${window.location.origin}/`;
    
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          username: username,
          is_driver: isDriver
        }
      }
    });

    if (error) {
      toast({
        title: "Signup Error",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }

    // If user is immediately available (email confirmation disabled), create role and driver profile
    if (authData.user) {
      const role = isDriver ? 'driver' : 'passenger';
      
      // Create user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: authData.user.id, role });

      if (roleError) {
        console.error('Error creating user role:', roleError);
      }

      // If driver, create driver profile
      if (isDriver) {
        const { error: driverError } = await supabase
          .from('driver_profiles')
          .insert({ user_id: authData.user.id });

        if (driverError) {
          console.error('Error creating driver profile:', driverError);
        }
      }
    }

    toast({
      title: "Success",
      description: "Please check your email to confirm your account",
    });

    return { error };
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    let email = emailOrUsername;

    // Check if input is username (doesn't contain @)
    if (!emailOrUsername.includes('@')) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailOrUsername)
        .maybeSingle();

      if (profileError || !profile || !profile.email) {
        toast({
          title: "Login Error",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return { error: { message: "Invalid username or password" } };
      }

      email = profile.email;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Login Error", 
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }

    // Fetch user role and redirect accordingly
    if (data.user) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle();

      const role = roleData?.role;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      // Redirect based on role
      setTimeout(() => {
        if (role === 'driver') {
          window.location.href = '/driver-dashboard';
        } else {
          window.location.href = '/';
        }
      }, 100);
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    }

    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setIsPasswordRecovery(false);
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    }

    return { error };
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isPasswordRecovery,
    loading,
    userRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};