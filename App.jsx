import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, ShoppingBag, Trophy, CheckCircle, Clock, Plus, X, Check, Flame } from 'lucide-react';

const INITIAL_USERS = [
  { id: 'p1', name: 'Parents', role: 'parent', avatar: '🛡️' },
  { id: 'k1', name: 'Leo', role: 'kid', avatar: '🦁', level: 3, xp: 340, coins: 85, streak: 4 },
  { id: 'k2', name: 'Maya', role: 'kid', avatar: '🦊', level: 2, xp: 190, coins: 40, streak: 2 }
];

const INITIAL_CHORES = [
  { id: 'c1', title: 'Make Bed', difficulty: 'Easy', xp: 20, coins: 5, assignedTo: 'k1', status: 'completed' },
  { id: 'c2', title: 'Feed Pet', difficulty: 'Easy', xp: 20, coins: 5, assignedTo: 'k1', status: 'todo' },
  { id: 'c3', title: 'Pack Backpack', difficulty: 'Easy', xp: 25, coins: 5, assignedTo: 'k1', status: 'pending_approval' },
  { id: 'c4', title: 'Organize Toys', difficulty: 'Medium', xp: 50, coins: 15, assignedTo: 'k1', status: 'todo' },
  { id: 'c5', title: 'Brush Teeth', difficulty: 'Easy', xp: 20, coins: 5, assignedTo: 'k2', status: 'completed' },
  { id: 'c6', title: 'Fold Clothes', difficulty: 'Medium', xp: 45, coins: 10, assignedTo: 'k2', status: 'todo' },
  { id: 'c7', title: 'Wipe Table', difficulty: 'Easy', xp: 25, coins: 5, assignedTo: 'k2', status: 'todo' },
  { id: 'c8', title: 'Yard Work', difficulty: 'Hard', xp: 100, coins: 30, assignedTo: 'k1', status: 'todo' }
];

const INITIAL_REWARDS = [
  { id: 'r1', title: '30 Mins Screen Time', cost: 50, icon: '🎮' },
  { id: 'r2', title: 'Pick Friday Movie', cost: 75, icon: '🍿' },
  { id: 'r3', title: 'Ice Cream Trip', cost: 120, icon: '🍦' }
];

export default function App() {
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('cq_users') || JSON.stringify(INITIAL_USERS)));
  const [chores, setChores] = useState(() => JSON.parse(localStorage.getItem('cq_chores') || JSON.stringify(INITIAL_CHORES)));
  const [rewards, setRewards] = useState(() => JSON.parse(localStorage.getItem('cq_rewards') || JSON.stringify(INITIAL_REWARDS)));
  const [activeUserId, setActiveUserId] = useState('k1');
  const [activeTab, setActiveTab] = useState('quests');
  const [banner, setBanner] = useState(null);

  useEffect(() => { localStorage.setItem('cq_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('cq_chores', JSON.stringify(chores)); }, [chores]);
  useEffect(() => { localStorage.setItem('cq_rewards', JSON.stringify(rewards)); }, [rewards]);

  const currentUser = users.find(u => u.id === activeUserId) || users[0];

  const showBanner = (msg) => {
    setBanner(msg);
    setTimeout(() => setBanner(null), 2500);
  };

  const markComplete = (id) => {
    setChores(prev => prev.map(c => c.id === id ? { ...c, status: 'pending_approval' } : c));
    showBanner('Quest sent for review! ⚔️');
  };

  const approveChore = (id) => {
    const chore = chores.find(c => c.id === id);
    if (!chore) return;
    setChores(prev => prev.map(c => c.id === id ? { ...c, status: 'completed' } : c));
    setUsers(prev => prev.map(u => {
      if (u.id === chore.assignedTo) {
        const nextXp = (u.xp || 0) + chore.xp;
        return { ...u, xp: nextXp, level: Math.floor(nextXp / 150) + 1, coins: (u.coins || 0) + chore.coins };
      }
      return u;
    }));
    showBanner('Approved! XP & Coins awarded! 🎉');
  };

  return (
    <div className="flex justify-center min-h-screen bg-slate-950 font-sans">
      <div className="w-full max-w-md bg-slate-900 flex flex-col min-h-screen border-x border-slate-800">
        
        {banner && (
          <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-center shadow-lg text-sm">
            {banner}
          </div>
        )}

        {/* Top bar */}
        <header className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10 flex items-center justify-between">
          <select 
            value={activeUserId} 
            onChange={e => {
              setActiveUserId(e.target.value);
              setActiveTab(e.target.value === 'p1' ? 'parent' : 'quests');
            }}
            className="bg-slate-800 text-white font-bold p-2 rounded-xl border border-slate-700 text-sm outline-none"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.avatar} {u.name} ({u.role})</option>
            ))}
          </select>

          {currentUser.role === 'kid' && (
            <div className="flex gap-2">
              <span className="bg-amber-500/20 text-amber-300 font-extrabold px-2.5 py-1 rounded-xl text-xs border border-amber-500/30">
                🪙 {currentUser.coins}
              </span>
              <span className="bg-orange-500/20 text-orange-400 font-extrabold px-2.5 py-1 rounded-xl text-xs border border-orange-500/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> {currentUser.streak}d
              </span>
            </div>
          )}
        </header>

        {/* Level progress */}
        {currentUser.role === 'kid' && (
          <div className="px-4 py-2 bg-slate-850 border-b border-slate-800">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Level {currentUser.level}</span>
              <span>{currentUser.xp % 150} / 150 XP</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all" 
                style={{ width: `${((currentUser.xp % 150) / 150) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main tabs */}
        <main className="flex-1 p-4 overflow-y-auto pb-20 space-y-3">
          {activeTab === 'quests' && (
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">Available Quests</h2>
              {chores.filter(c => c.assignedTo === currentUser.id).map(chore => (
                <div key={chore.id} className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                      {chore.difficulty}
                    </span>
                    <p className="font-bold text-sm mt-1">{chore.title}</p>
                    <p className="text-xs text-slate-400">+{chore.xp} XP • +{chore.coins} 🪙</p>
                  </div>
                  <div>
                    {chore.status === 'completed' && <span className="text-xs text-emerald-400 font-bold">Done ✓</span>}
                    {chore.status === 'pending_approval' && <span className="text-xs text-amber-400 font-bold">In Review</span>}
                    {chore.status === 'todo' && (
                      <button 
                        onClick={() => markComplete(chore.id)} 
                        className="bg-indigo-600 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow"
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shop' && (
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">Rewards</h2>
              <div className="grid grid-cols-2 gap-3">
                {rewards.map(r => (
                  <div key={r.id} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-center">
                    <span className="text-3xl block mb-2">{r.icon}</span>
                    <p className="font-bold text-xs">{r.title}</p>
                    {currentUser.role === 'kid' ? (
                      <button 
                        onClick={() => {
                          if (currentUser.coins < r.cost) return alert('Not enough coins!');
                          setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, coins: u.coins - r.cost } : u));
                          showBanner(`Redeemed ${r.title}! 🎁`);
                        }}
                        className="mt-2 w-full py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-lg"
                      >
                        {r.cost} 🪙
                      </button>
                    ) : (
                      <span className="text-xs text-amber-400 font-bold mt-2 block">{r.cost} Coins</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'parent' && (
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">Pending Approvals</h2>
              {chores.filter(c => c.status === 'pending_approval').length === 0 ? (
                <p className="text-xs text-slate-500 italic">No chores waiting for approval.</p>
              ) : (
                chores.filter(c => c.status === 'pending_approval').map(c => (
                  <div key={c.id} className="p-3 bg-slate-800 border border-amber-500/30 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">{c.title}</p>
                      <p className="text-xs text-slate-400">{users.find(u => u.id === c.assignedTo)?.name}</p>
                    </div>
                    <button 
                      onClick={() => approveChore(c.id)}
                      className="bg-emerald-600 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                    >
                      Approve
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 max-w-md w-full bg-slate-900 border-t border-slate-800 flex justify-around p-3 z-20">
          {currentUser.role === 'kid' ? (
            <>
              <button onClick={() => setActiveTab('quests')} className={`text-xs font-bold ${activeTab === 'quests' ? 'text-indigo-400' : 'text-slate-500'}`}>Quests</button>
              <button onClick={() => setActiveTab('shop')} className={`text-xs font-bold ${activeTab === 'shop' ? 'text-amber-400' : 'text-slate-500'}`}>Shop</button>
            </>
          ) : (
            <button onClick={() => setActiveTab('parent')} className="text-xs font-bold text-emerald-400">Parent Approvals</button>
          )}
        </nav>

      </div>
    </div>
  );
}
