import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = mode === "login" ? "Entrar - CRM" : "Cadastrar - CRM";

    // Redirect if already authenticated
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/");
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/");
    });

    return () => subscription.unsubscribe();
  }, [mode, navigate]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Login realizado", description: "Você está autenticado." });
      navigate("/");
    } catch (e: any) {
      toast({ title: "Erro ao entrar", description: e?.message ?? "Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      });
      if (error) throw error;
      toast({ title: "Cadastro realizado", description: "Verifique seu e-mail para confirmar o acesso." });
    } catch (e: any) {
      toast({ title: "Erro ao cadastrar", description: e?.message ?? "Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") handleLogin();
    else handleSignup();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">{mode === "login" ? "Entrar no CRM" : "Criar sua conta"}</CardTitle>
          <CardDescription>Use e-mail e senha para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="voce@empresa.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Sua senha" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Cadastrar"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Não tem conta? {" "}
                <button onClick={() => setMode("signup")} className="text-primary hover:underline">Cadastre-se</button>
              </>
            ) : (
              <>
                Já tem conta? {" "}
                <button onClick={() => setMode("login")} className="text-primary hover:underline">Entrar</button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Auth;
