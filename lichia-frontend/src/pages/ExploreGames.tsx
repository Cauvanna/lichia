setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lichia-from"
              />
            </div>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lichia-from"
            >
              <option value="all">Todos os Gêneros</option>
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-lichia-from text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-lichia-from text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid/Lista de Jogos */}
        {filteredGames.length > 0 ? (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}`}>
            {filteredGames.map((game) => (
              viewMode === 'grid' ? (
                <GameCard key={game.id} game={game} onGameClick={handleGameClick} showStatus={false} />
              ) : (
                <GameListItem key={game.id} game={game} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg p-12 max-w-md mx-auto">
              <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum game encontrado</h3>
              <p className="text-gray-400 mb-6">Tente ajustar sua busca ou filtros.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreGames;
