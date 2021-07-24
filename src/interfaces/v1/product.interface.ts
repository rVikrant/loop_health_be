declare namespace IProductRequestV1 {
    interface IGetProducts {
        page?: number;
        sortBy?: string;
        search?: string;
        brands?: string[];
        gender?: string[];
        categories?: string[];
    }
}