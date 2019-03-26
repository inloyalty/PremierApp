export interface IFilter {
    PageSize: number;
    PageIndex: number;
    SortOrder: string;
    OrderBy: string;
    SearchText: string;
    TotalItems: number;
}
export class Filter implements IFilter {
    PageSize = 20;
    PageIndex = 1;
    SortOrder = 'DESC';
    OrderBy= "Id";
    SearchText: string;
    TotalItems: 0;
}


export class LookupFilter implements IFilter {
    PageSize = 999999;
    PageIndex = 1;
    SortOrder = 'ASC';
    OrderBy= "Id";
    SearchText: string;
    TotalItems: 0;
}