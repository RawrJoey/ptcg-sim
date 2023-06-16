import { useInterfaceActions } from "@/features/interface/useInterfaceActions";
import { Challenge, useChallenges } from "@/features/social/challenges/useChallenges";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useRef } from "react"

export const useGameStartedListener = () => {
  const user = useUser();
  const { data: challenges } = useChallenges(user?.id);
  const supabase = useSupabaseClient();
  const { startGame } = useInterfaceActions();

  const userIdRef = useRef<string | undefined>();

  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  useEffect(() => {
    supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
        },
        (payload) => {
          if (payload.table === 'Challenges' && (payload.new.challengee === userIdRef.current || payload.new.challenger === userIdRef.current) && payload.new.gameIsRunning) {
            startGame();
          }
        }
      )
      .subscribe()
  }, []);
}