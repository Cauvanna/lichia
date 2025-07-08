import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, EyeOff, Star, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import lichiaLogoUrl from '../assets/lichia.png';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user || !token) {
        navigate('/login');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const req = {
          comunicacao: 'request-painel-usuario',
          username: user.username,
          id_usr: parseInt(user.id, 10),
          token: token
        };
        const response = await fetch('http://localhost:8080/request-painel-usuario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req)
        });
        const data = await response.json();
        if (data.mensagem) {
          setError(data.mensagem);
        } else {
          setProfileData(data);
        }
      } catch (e) {
        setError('Erro ao buscar dados do perfil.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [isAuthenticated, user, token]);

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <span className="text-white text-lg">Carregando perfil...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{error}</h1>
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

  // Usa os dados vindos do backend, mas mantém fallback para user do contexto
  const displayName = profileData?.nome || user.displayName;
  const username = profileData?.nome || user.username;
  const visibilidade = profileData?.visibilidade ?? user.visibilidade;
  const dataCadastro = profileData?.data_cadastro || user.dataCadastro;
  const dataNascimento = profileData?.data_nascimento || user.dataNascimento;
  const avatar = lichiaLogoUrl; // Usa a imagem da Lichia como avatar
  const bio = user.bio;

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
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={avatar}
              alt={displayName}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-lichia-from bg-gray-300"
            />

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{displayName}</h1>
              <p className="text-gray-400 text-lg mb-4">@{username}</p>

              <p className="text-gray-300 mb-6 max-w-2xl">{bio}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">Nome</div>
                  <div className="text-gray-400 text-sm">{displayName}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xl font-bold text-white">
                    {visibilidade ? (
                      <Eye className="w-5 h-5 text-green-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {visibilidade ? 'Público' : 'Privado'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">Nascimento</div>
                  <div className="text-gray-400 text-sm">{formatDate(dataNascimento)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">Cadastro</div>
                  <div className="text-gray-400 text-sm">{formatDate(dataCadastro)}</div>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Membro desde {formatDate(dataCadastro)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate(`/user/${user.id}/reviews`)} // Corrigido para usar ID do usuário logado
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Histórico de Avaliações</h3>
            </div>
            <p className="text-gray-400">Veja todas as suas avaliações e resenhas</p>
          </button>

          <button
            onClick={() => navigate('/wishlist')}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Lista de Desejos</h3>
            </div>
            <p className="text-gray-400">Gerencie sua lista de jogos desejados</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
