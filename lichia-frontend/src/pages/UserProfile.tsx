import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Eye, EyeOff, Star, Heart, ArrowLeft } from 'lucide-react';
import lichiaLogoUrl from '../assets/lichia.png';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: loggedUser, token } = useAuth();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const isVisitor = !loggedUser;
    const req = {
      comunicacao: 'request-pagina-usuario',
      usr_alvo: 'giovanna', // hardcoded para teste
      id_usr_alvo: parseInt(id, 10),
      id_usr_solicitante: isVisitor ? 0 : (loggedUser ? parseInt(loggedUser.id, 10) : 0),
      usr_solicitante: isVisitor ? '' : (loggedUser?.username || ''),
      token: isVisitor ? '' : (token || '')
    };
    setLoading(true);
    setError('');
    fetch('http://localhost:8080/request-pagina-usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    })
      .then(res => res.json())
      .then(data => {
        console.log('DEBUG - JSON recebido do backend:', data); // <-- Aqui você pode ver o JSON de resposta
        setProfileData(data);
      })
      .catch(err => {
        setError('Erro ao buscar dados do usuário');
      })
      .finally(() => setLoading(false));
  }, [id, loggedUser, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <span className="text-white text-lg">Carregando dados do usuário...</span>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{error || 'Usuário não encontrado'}</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-lichia-from hover:bg-lichia-to text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data inválida';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar com as duas primeiras letras do nome do usuário */}
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent((profileData.nome || '').slice(0,2) || 'US')}`}
              alt={profileData.nome}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-lichia-from"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{profileData.nome}</h1>
              <p className="text-gray-400 text-lg mb-4">@{profileData.nome}</p>
              <div className="flex flex-col gap-1 justify-center md:justify-start mb-4">
                <span className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Cadastro:</span>
                  <span className="ml-1 font-medium text-white">{formatDate(profileData.data_cadastro)}</span>
                </span>
                <span className="flex items-center gap-1 text-gray-400 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>Nascimento:</span>
                  <span className="ml-1 font-medium text-white">{formatDate(profileData.data_nascimento)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                {profileData.visibilidade ? (
                  <span className="flex items-center gap-1 text-green-400"><Eye className="w-4 h-4" /> Perfil Público</span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400"><EyeOff className="w-4 h-4" /> Perfil Privado</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate(`/user/${id}/reviews`)}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Histórico de Avaliações</h3>
            </div>
            <p className="text-gray-400">Veja as avaliações e resenhas deste usuário</p>
          </button>

          <button
            onClick={() => navigate(`/user/${id}/wishlist`)}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Lista de Desejos</h3>
            </div>
            <p className="text-gray-400">Veja a lista de jogos desejados</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
