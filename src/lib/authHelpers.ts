import { supabase } from './supabaseClient';

/**
 * Prüft, ob eine E-Mail-Adresse bereits registriert ist
 * @param email Die zu prüfende E-Mail-Adresse
 * @returns Promise<boolean> - true wenn E-Mail bereits existiert
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // Methode 1: Versuche RPC-Funktion
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('check_email_availability', {
        check_email: email.toLowerCase()
      });

    if (!rpcError && rpcData !== null) {
      console.log("RPC-Funktion erfolgreich:", rpcData);
      return rpcData === true;
    }

    // Methode 2: Fallback - Direkte Abfrage mit öffentlicher Policy
    console.log("RPC fehlgeschlagen, verwende Fallback");
    return await checkEmailExistsFallback(email);
    
  } catch (error) {
    console.error("Unerwarteter Fehler bei E-Mail-Prüfung:", error);
    // Methode 3: Letzter Fallback
    return await checkEmailExistsFallback(email);
  }
}

/**
 * Fallback-Funktion für E-Mail-Prüfung (direkte Abfrage)
 * @param email Die zu prüfende E-Mail-Adresse
 * @returns Promise<boolean> - true wenn E-Mail bereits existiert
 */
async function checkEmailExistsFallback(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("appusers")
      .select("email")
      .eq("email", email.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = "No rows returned" - das ist in Ordnung
      console.error("Fallback: Fehler beim Prüfen der E-Mail:", error);
    }

    return !!data; // true wenn Daten gefunden wurden
  } catch (error) {
    // Wenn kein Benutzer gefunden wird, ist das in Ordnung
    return false;
  }
}

/**
 * Erstellt eine benutzerfreundliche Fehlermeldung für Auth-Fehler
 * @param errorMessage Die ursprüngliche Fehlermeldung von Supabase
 * @param context Der Kontext (login, register, reset)
 * @returns Benutzerfreundliche Fehlermeldung
 */
export function getAuthErrorMessage(errorMessage: string, context: 'login' | 'register' | 'reset' = 'login'): string {
  const message = errorMessage.toLowerCase();

  switch (context) {
    case 'register':
      if (message.includes("already registered") || message.includes("user already registered")) {
        return "Diese E-Mail-Adresse ist bereits registriert. Falls Sie Ihr Passwort vergessen haben, können Sie es über 'Login' → 'Passwort vergessen' zurücksetzen.";
      } else if (message.includes("invalid email")) {
        return "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
      } else if (message.includes("password should be at least")) {
        return "Das Passwort muss mindestens 8 Zeichen lang sein.";
      } else if (message.includes("too many requests")) {
        return "Zu viele Registrierungsversuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.";
      }
      break;

    case 'login':
      if (message.includes("invalid login credentials")) {
        return "E-Mail-Adresse oder Passwort ist falsch. Bitte überprüfen Sie Ihre Eingaben.";
      } else if (message.includes("email not confirmed")) {
        return "Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Prüfen Sie Ihr E-Mail-Postfach und klicken Sie auf den Bestätigungslink.";
      } else if (message.includes("user not found")) {
        return "Diese E-Mail-Adresse ist nicht registriert. Bitte registrieren Sie sich zuerst.";
      } else if (message.includes("too many requests")) {
        return "Zu viele Anmeldeversuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.";
      }
      break;

    case 'reset':
      if (message.includes("user not found")) {
        return "Diese E-Mail-Adresse ist nicht registriert. Bitte registrieren Sie sich zuerst.";
      } else if (message.includes("too many requests")) {
        return "Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.";
      }
      break;
  }

  // Fallback für unbekannte Fehler
  return `Fehler: ${errorMessage}`;
}

/**
 * Validiert eine E-Mail-Adresse
 * @param email Die zu validierende E-Mail-Adresse
 * @returns true wenn die E-Mail gültig ist
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return emailRegex.test(email);
}

/**
 * Validiert ein Passwort
 * @param password Das zu validierende Passwort
 * @returns Objekt mit isValid und message
 */
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 8) {
    return { isValid: false, message: "Das Passwort muss mindestens 8 Zeichen lang sein." };
  }
  
  // Optional: Weitere Validierungen hinzufügen
  // if (!/[A-Z]/.test(password)) {
  //   return { isValid: false, message: "Das Passwort muss mindestens einen Großbuchstaben enthalten." };
  // }
  
  return { isValid: true };
} 