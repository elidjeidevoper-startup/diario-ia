'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Diario() {
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const router = useRouter();
  const [aiReply, setAiReply] = useState('');

  const fetchEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Salva no banco
    const { error } = await supabase.from('entries').insert([{ content, user_id: user.id }]);
    
    if (error) {
        alert("Erro ao salvar");
    } else {
        // 2. Chama a IA
        const res = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ text: content }),
        });
        const data = await res.json();
        setAiReply(data.reply);
        setContent('');
        fetchEntries();
    }
};

  // Nova função para deletar
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', id);

    if (error) alert("Erro ao excluir: " + error.message);
    else {
      // Remove da lista na tela instantaneamente
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Diário IA</h1>
          <button onClick={() => { supabase.auth.signOut(); router.push('/'); }} className="text-sm text-gray-500 hover:text-orange-500">Sair</button>
        </header>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Como você está se sentindo hoje?..."
          className="w-full h-32 p-6 rounded-[2rem] border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
        />
        <button onClick={handleSave} className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition-all">
          Salvar Entrada
        </button>

        {aiReply && (
        <div className="mt-6 p-6 bg-orange-50 border border-orange-200 rounded-[2rem] text-orange-900">
          <h3 className="font-bold mb-2">Reflexão da IA:</h3>
          <p>{aiReply}</p>
        </div>
      )}

        <div className="mt-12 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Seus desabafos:</h2>
          {entries.map((entry) => (
            <div key={entry.id} className="p-6 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm relative group">
              <p className="text-gray-700">{entry.content}</p>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">
                  {new Date(entry.created_at).toLocaleDateString('pt-BR')}
                </span>
                
                {/* Botão de excluir */}
                <button 
                  onClick={() => handleDelete(entry.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}