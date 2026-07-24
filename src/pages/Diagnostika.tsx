import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Clock, Database, RefreshCw, XCircle } from "lucide-react";

interface SyncStatus {
  icalConfigured: boolean;
  lastSync: {
    status: string;
    reservations_count: number | null;
    error_message: string | null;
    duration_ms: number | null;
    created_at: string;
  } | null;
  upcomingBlockedRanges: number;
  now: string;
}

const Diagnostika = () => {
  const [data, setData] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("token") ?? ""
      : "";

  const load = async () => {
    if (!token) {
      setError("Manjkajoč admin token. Dostop dovoljen le z ?token=…");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("sync-status", {
        headers: { "x-admin-token": token },
      });
      if (error) throw error;
      setData(data as SyncStatus);
    } catch (e: any) {
      setError(e?.message || "Napaka pri nalaganju stanja");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastSyncAgeMin = data?.lastSync
    ? Math.round((Date.now() - new Date(data.lastSync.created_at).getTime()) / 60000)
    : null;
  const syncStale = lastSyncAgeMin !== null && lastSyncAgeMin > 60;

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Diagnostika sistema</h1>
            <p className="text-muted-foreground">Stanje iCal sinhronizacije s Booking.com</p>
          </div>
          <Button onClick={load} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Osveži
          </Button>
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6 text-destructive">
              <div className="flex gap-2 items-start">
                <XCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {!data && loading && (
          <Card><CardContent className="pt-6 text-muted-foreground">Nalaganje…</CardContent></Card>
        )}

        {data && (
          <>
            <Card className={data.icalConfigured ? "" : "border-destructive"}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5" />
                  BOOKING_ICAL_URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.icalConfigured ? (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Nastavljen
                  </Badge>
                ) : (
                  <div className="space-y-2">
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" /> MANJKAJOČ
                    </Badge>
                    <p className="text-sm text-destructive">
                      Skrivnost <code>ICAL_BOOKING_URL</code> ni nastavljena. Sinhronizacija koledarja ne bo delovala.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className={syncStale ? "border-amber-500" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Zadnja sinhronizacija
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.lastSync ? (
                  <>
                    <div className="flex items-center gap-2">
                      {data.lastSync.status === "success" ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> uspešno
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" /> napaka
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {new Date(data.lastSync.created_at).toLocaleString("sl-SI")}
                        {lastSyncAgeMin !== null && ` (pred ${lastSyncAgeMin} min)`}
                      </span>
                    </div>
                    {syncStale && (
                      <p className="text-sm text-amber-600">
                        ⚠️ Zadnja sinhronizacija je stara več kot 60 min – preverite cron.
                      </p>
                    )}
                    {data.lastSync.reservations_count !== null && (
                      <p className="text-sm">Sinhroniziranih rezervacij: <strong>{data.lastSync.reservations_count}</strong></p>
                    )}
                    {data.lastSync.duration_ms !== null && (
                      <p className="text-sm text-muted-foreground">Trajanje: {data.lastSync.duration_ms} ms</p>
                    )}
                    {data.lastSync.error_message && (
                      <p className="text-sm text-destructive">Napaka: {data.lastSync.error_message}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Ni še zabeležene sinhronizacije.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5" />
                  Blokirani prihodnji datumi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold">{data.upcomingBlockedRanges}</p>
                <p className="text-sm text-muted-foreground">obsegov v koledarju (danes ali kasneje)</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
};

export default Diagnostika;
