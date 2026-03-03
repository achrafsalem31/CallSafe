// CallSafe - Supabase Database

const SUPABASE_URL = 'https://irfxrvincoaacwpialqp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZnhydmluY29hYWN3cGlhbHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzIzMTYsImV4cCI6MjA4NjQwODMxNn0.o7GlOpeUoSl5aRmkZSKGhglIsYUMxmTEDtMswCJkQac';

// Supabase Client initialisieren
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Nummer in Datenbank prüfen
 */
async function checkNumberInDB(phoneNumber) {
  try {
    const { data, error } = await supabaseClient
      .from('numbers')
      .select('*')
      .eq('phone', phoneNumber)
      .single();

    // Pas trouvé
    if (error) {
      if (error.code === 'PGRST116') {
        return {
          status: 'warning',
          title: '⚠️ UNBEKANNT / VORSICHT',
          reason: 'Diese Nummer ist uns noch nicht bekannt.',
          category: 'Verdächtig bei: Geldforderung, Zeitdruck, Geheimniskrämerei',
          action: '💡 Bei Geldforderung sofort auflegen! Im Zweifel Nummer hier melden.'
        };
      }
      throw error;
    }

    // Trouvé
    let statusLevel = data.status || 'warning';
    if ((data.reports_count || 0) >= 5) statusLevel = 'danger';

    const categoryNames = {
      enkeltrick: 'Enkeltrick',
      polizei: 'Falsche Polizisten',
      schock: 'Schockanruf',
      bank: 'Bank-Betrug',
      techsupport: 'Tech-Support',
      gewinnspiel: 'Gewinnspiel',
      sonstiges: 'Sonstiges'
    };

    return {
      status: statusLevel,
      title: statusLevel === 'danger' ? '🚨 BETRUG BESTÄTIGT' : '⚠️ VORSICHT',
      reason: `Diese Nummer wurde ${data.reports_count || 1}x gemeldet.`,
      category: `Kategorie: ${categoryNames[data.category] || 'Unbekannt'}`,
      action: statusLevel === 'danger'
        ? '⚠️ SOFORT AUFLEGEN! Nicht zurückrufen. Nummer blockieren.'
        : 'Bei Geldforderung oder Druck: auflegen und melden.'
    };

  } catch (e) {
    console.error('❌ Fehler beim Prüfen:', e);
    return {
      status: 'warning',
      title: '⚠️ FEHLER',
      reason: 'Fehler beim Durchsuchen der Datenbank (RLS/Netzwerk).',
      category: '',
      action: 'Bitte später erneut versuchen.'
    };
  }
}
/**
 * Nummer in Datenbank melden
 */
async function reportNumberToDB(phoneNumber, category, details = '') {
  try {
    const { error } = await supabaseClient
      .from('reports')
      .insert([{
        phone: phoneNumber,
        category: category || 'sonstiges',
        details: details || ''
      }]);

    if (error) throw error;

    console.log('✅ Report gespeichert:', phoneNumber);
    return true;
  } catch (e) {
    console.error('❌ Fehler beim Melden:', e);
    return false;
  }
}

/**
 * Alle gemeldeten Nummern abrufen
 */
async function getAllNumbersFromDB() {
    try {
        const { data, error } = await supabaseClient
            .from('numbers')
            .select('*')
            .order('reports_count', { ascending: false });

        if (error) throw error;
        return data || [];

    } catch (error) {
        console.error('❌ Fehler beim Abrufen:', error);
        return [];
    }
}

/**
 * Statistiken aus Datenbank abrufen
 */
async function getStatisticsFromDB() {
    try {
        const { data } = await supabaseClient
            .from('numbers')
            .select('*');

        const totalNumbers = data?.length || 0;
        const totalReports = data?.reduce((sum, n) => sum + (n.reports_count || 1), 0) || 0;

        // Nach Kategorie gruppieren
        const byCategory = {};
        data?.forEach(n => {
            const cat = n.category || 'sonstiges';
            byCategory[cat] = (byCategory[cat] || 0) + (n.reports_count || 1);
        });

        console.log('📊 Statistiken abgerufen:', { totalNumbers, totalReports });

        return {
            totalNumbers,
            totalReports,
            byCategory
        };

    } catch (error) {
        console.error('❌ Fehler:', error);
        return {
            totalNumbers: 0,
            totalReports: 0,
            byCategory: {}
        };
    }
}

/**
 * Top gemeldete Nummern
 */
async function getTopNumbersFromDB(limit = 10) {
    try {
        const { data, error } = await supabaseClient
            .from('numbers')
            .select('*')
            .order('reports_count', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];

    } catch (error) {
        console.error('❌ Fehler:', error);
        return [];
    }
}

/**
 * Nummer suchen (mit Wildcard)
 */
async function searchNumbersInDB(searchTerm) {
    try {
        const { data, error } = await supabaseClient
            .from('numbers')
            .select('*')
            .ilike('phone', `%${searchTerm}%`)
            .order('reports_count', { ascending: false })
            .limit(20);

        if (error) throw error;
        return data || [];

    } catch (error) {
        console.error('❌ Fehler:', error);
        return [];
    }
}

/**
 * Nummer löschen (Admin)
 */
async function deleteNumberFromDB(phoneNumber) {
    try {
        const { error } = await supabaseClient
            .from('numbers')
            .delete()
            .eq('phone', phoneNumber);

        if (error) throw error;
        console.log('🗑️ Nummer gelöscht:', phoneNumber);
        return true;

    } catch (error) {
        console.error('❌ Fehler:', error);
        return false;
    }
}

// Global verfügbar machen
window.DB = {
    checkNumber: checkNumberInDB,
    reportNumber: reportNumberToDB,
    getAllNumbers: getAllNumbersFromDB,
    getStatistics: getStatisticsFromDB,
    getTopNumbers: getTopNumbersFromDB,
    searchNumbers: searchNumbersInDB,
    deleteNumber: deleteNumberFromDB
};

console.log('✅ SECUREME Datenbank verbunden!');
console.log('📊 URL:', SUPABASE_URL);
console.log('📋 Tabelle: numbers');
