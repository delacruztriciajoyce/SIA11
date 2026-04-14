const searchClient = algoliasearch('IPKKB839TV', 'df548e5591b9c97e9ec2042350c021cc');

const search = instantsearch({
    indexName: 'movie_index',
    searchClient,
});

search.addWidgets([
    // Search Box
    instantsearch.widgets.searchBox({
        container: '#searchbox',
        placeholder: 'Search movies, genres, or overviews...',
    }),

    // Genre Sidebar Filter
    instantsearch.widgets.refinementList({
        container: '#genre-filter',
        attribute: 'genre',
        templates: {
            header: '<strong>Genre</strong>',
        },
    }),

    // Year Sidebar Filter
    instantsearch.widgets.refinementList({
        container: '#year-filter',
        attribute: 'year',
        limit: 8,
        showMore: true,
        templates: {
            header: '<strong>Year</strong>',
        },
    }),

    // Results Display
    instantsearch.widgets.hits({
        container: '#hits',
        templates: {
            item: (hit) => `
                <article class="movie-card">
                    <img src="${hit.poster_url || 'https://via.placeholder.com/140x210?text=No+Image'}" 
                         class="movie-poster" alt="${hit.title}">
                    <div class="movie-content">
                        <h2 class="movie-title">
                            ${instantsearch.highlight({ attribute: 'title', hit })}
                        </h2>
                        <p>
                            <strong>${hit.year || 'Unknown'}</strong> | 
                            ⭐ ${hit.vote_average || 'N/A'}
                        </p>
                        <p><em>${Array.isArray(hit.genre) ? hit.genre.join(', ') : (hit.genre || 'Uncategorized')}</em></p>
                        <p class="movie-overview">
                            ${instantsearch.snippet({ attribute: 'overview', hit })}
                        </p>
                    </div>
                </article>
            `,
            empty: (results) => `No results found for "${results.query}".`
        },
    }),

    // Pagination
    instantsearch.widgets.pagination({
        container: '#pagination',
    })
]);

search.start();