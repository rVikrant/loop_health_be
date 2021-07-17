declare namespace IProductRequestV1 {
    interface IGetProducts {
        page?: number;
        sortBy?: string;
        search?: string;
        brand?: string;
        category?: string;
    }
}