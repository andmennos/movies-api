export interface Movie {
    id: number;
    nome: string;
    anoLancamento: number;
    descricao: string;
    genero: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalMovies: number;
    moviesPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface MovieFilters {
    sortBy: string;
    order: 'asc' | 'desc';
    genero: string;
}

export interface RequisicaoMovies {
    page: number; 
    limit: number,
    sortBy: string,
    order: 'asc' | 'desc',
    genero: string
}

export interface ResponseMovies {
    data: Movie[];
    pagination: Pagination;
    filters: MovieFilters;
}

export interface ResponseFilters {
    availableGenres: string[];
    availableSortFields: string[];
    sortOrders: ('asc' | 'desc')[];
}