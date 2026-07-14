'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Importe o seu supabase de acordo com a pasta onde ele está configurado
import { supabase } from '@/lib/supabase'; 

export default function Diario() {
  // ==========================================
  // 1. HOOKS: Sempre no topo e DENTRO do componente
  // ==========================================
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [aiReply, setAiReply] = useState('');
  const router = useRouter();

  // ==========================================
  // 2. USE EFFECT: Roda ao abrir a página
  // ==========================================
  useEffect(() => {
    fetchEntries();
  }, []);

  // ==========================================
  // 3. FUNÇÕES (Lógicas de banco de dados e IA)
  // ==========================================
  const fetchEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false }); // Traz os mais recentes primeiro

    if (data) setEntries(data);
  };

  const handleSave = async () => {
    if (!content.trim()) return; // Não salva se estiver vazio

    // 1. Lógica de salvar no Supabase...
    // 2. Lógica de chamar a rota da IA (ex: fetch('/api/chat'))...
    // 3. Atualizar o estado da IA (ex: setAiReply(respostaDaIA))...

    setContent(''); // Limpa o campo de texto
    fetchEntries(); // Atualiza a lista na tela
  };

  const handleDelete = async (id: string) => {
    await supabase.from('entries').delete().eq('id', id);
    fetchEntries(); // Atualiza a lista após deletar
  };

  // ==========================================
  // 4. RETURN: Estrutura visual da página
  // ==========================================
  return (
    <main className="min-h-screen bg-[#FAFAFA] p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Diário IA</h1>
          <button
            onClick={() => { supabase.auth.signOut(); router.push('/'); }}
            className="text-sm text-gray-500 hover:text-orange-500"
          >
            Sair
          </button>
        </header>

        {/* Área de escrita */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Como você está se sentindo hoje?..."
          className="w-full h-32 p-6 rounded-[2rem] border border-gray-200 bg-white shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleSave}
          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-[2rem] transition-colors"
        >
          Salvar Entrada
        </button>

        {/* Área da IA */}
        {aiReply && (
          <div className="mt-6 p-6 bg-orange-50 border border-orange-200 rounded-[2rem] text-orange-900">
            <h3 className="font-bold mb-2">Reflexão da IA:</h3>
            <p>{aiReply}</p>
          </div>
        )}

        {/* Lista de entradas */}
        <div className="mt-12 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Seus desabafos:</h2>
          
          {entries.map((entry) => (
            <div key={entry.id} className="p-6 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
              <p className="text-gray-700">{entry.content}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">
                  {new Date(entry.created_at).toLocaleDateString('pt-BR')}
                </span>

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
} // ✅ AQUI É O FIM DO COMPONENTE DIARIO. Nada mais de chaves sobrando!