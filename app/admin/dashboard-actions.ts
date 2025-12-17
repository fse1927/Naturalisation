'use server'

import { createClient } from '@/lib/supabase/server';

export async function getDashboardStats() {
    const supabase = await createClient();

    // 1. Basic Counts
    const { count: userCount } = await supabase.from('utilisateurs').select('id', { count: 'exact', head: true });
    const { count: questionCount } = await supabase.from('questions').select('id', { count: 'exact', head: true });

    // Feedbacks pending
    let feedbackCount = 0;
    try {
        const { count } = await supabase.from('feedbacks_questions').select('id', { count: 'exact', head: true }).eq('status', 'pending');
        feedbackCount = count || 0;
    } catch (e) { }

    // 2. Recent Users (Last 5)
    // We need 'created_at' in utilisateurs table. Assuming migration is run.
    const { data: recentUsers } = await supabase
        .from('utilisateurs')
        .select('id, nom_prenom, email, is_admin, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    // 3. Activity Chart Data (Last 30 days tests)
    // We need to group by date. 
    // Supabase JS doesn't do "GROUP BY" easily without RPC.
    // Efficient way: Fetch all tests from last 30 days (selecting only date) and aggregate in JS. 
    // If volume is huge, we need RPC. For <10k tests, JS is fine.

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: rawTests } = await supabase
        .from('historique_tests')
        .select('date_test')
        .gte('date_test', thirtyDaysAgo.toISOString());

    // Aggregate by day
    const testsByDay: Record<string, number> = {};
    // Initialize last 30 days with 0
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }); // DD/MM
        testsByDay[dayStr] = 0;
    }

    if (rawTests) {
        rawTests.forEach(test => {
            const date = new Date(test.date_test);
            const dayStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
            if (testsByDay[dayStr] !== undefined) {
                testsByDay[dayStr]++;
            }
        });
    }

    // Convert to array and sort by date reverse (Oldest first for chart)
    const activityData = Object.entries(testsByDay)
        .map(([date, count]) => ({ date, tests: count }))
        .reverse(); // Actually my loop was Today -> Past, so reverse makes Past -> Today

    // 4. Format Recent Activity Feed
    const feedItems: any[] = [];

    if (recentUsers) {
        recentUsers.forEach(u => {
            feedItems.push({
                id: `user-${u.id}`,
                type: 'user',
                title: u.nom_prenom || 'Nouvel utilisateur',
                description: `S'est inscrit avec ${u.email}`,
                date: u.created_at,
                meta: u.is_admin ? 'admin' : 'user'
            });
        });
    }

    // Sort mixed feed by date
    feedItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
        userCount: userCount || 0,
        questionCount: questionCount || 0,
        feedbackCount,
        activityData,
        recentActivity: feedItems.slice(0, 5) // Top 5 mixed
    };
}
