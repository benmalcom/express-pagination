import  {URL} from 'url';
import  * as url from 'url';
import * as isUrl from 'is-url';
import * as queryString from 'query-string';
/**
 * The ExpressPagination class
 */
export default class ExpressPagination{
	/**
	 *@constructor
	 *@param {object} options
	 */
	private static readonly EXTRA_PAGES_ROUND = 3;
	private static readonly FIRST = 'first';
	private static readonly LAST = 'last';
	private static readonly CURRENT = 'current';
	private static readonly PREVIOUS = 'previous';
	private static readonly NEXT = 'next';
	private page: number = 1;
	private skip: number = 0;
	public limit: number = 20;
	private _totalCount: number = 0;
	private url: URL;
	private query: object;
	private pagination: object = {};
	constructor (private options: object){
		if(!options) {
			throw new Error('An options object is required');
		}
		if(!options.hasOwnProperty('url')) {
			throw new Error('A url options property is required');
		}
		if(!isUrl(options['url'])) {
			throw new Error('url property of options is not valid');
		}
		this.done = this.done.bind(this);

		this.url = new URL(options['url']);
		const search: string = this.url.search;
		this.query = queryString.parse(search);
		// Set Query overrides
		this.setQueryOverrides.apply(this);
		// Set Option overrides
		this.setOptionOverrides.apply(this);
	}
	/**
	 *@function
	 *@return {number} totalCount the items total count
	 */
	get totalCount(){
		return this._totalCount;
	}
	/**
	 *@function set the total count
	 */
	set totalCount(value: number){
		this._totalCount = value;
	}
	private setQueryOverrides(){
		if(this.query['page']) this.page = parseInt(this.query['page']);
		if(this.query['limit']) this.limit = parseInt(this.query['limit']);
		if(this.query['skip']) this.skip = parseInt(this.query['skip']);
	}
	private setOptionOverrides(){
		if(this.options['page']) this.page = parseInt(this.options['page']);
		if(this.options['limit']) this.limit = parseInt(this.options['limit']);
		if(this.options['skip']) this.page = parseInt(this.options['skip']);
		if(this.options['totalCount']) this.totalCount = parseInt(this.options['totalCount']);
	}

	/**
	 *@function setPage
	 */
	private setPage(prop: string, page: number){
		const skip = (page - 1) * this.limit;
		this.url.searchParams.set('page', page.toString());
		this.url.searchParams.set('skip', skip.toString());
		const url = this.url.href;
		this.pagination[prop] = {page, url};
	}
	/**
	 *@function Sets the current page
	 */
	private setCurrentPage(){
		const page = this.page;
		this.setPage(ExpressPagination.CURRENT, page);
	}
	/**
	 *@function Sets the first page
	 */
	private setFirstPage(){
		this.setPage(ExpressPagination.FIRST,1);
	}
	/**
	 *@function Sets the last page
	 */
	private setLastPage(){
		const page = Math.ceil(this.totalCount / this.limit);
		this.setPage(ExpressPagination.LAST, page);
	}
	/**
	 *@function
	 */
	private setPrevious(page: number){
		if(page > 1){
			const previous = [];
			const start = page - 1;
			for (let i = start; i > 0 && start - i <= ExpressPagination.EXTRA_PAGES_ROUND; i--){
				const skip = (i - 1) * this.limit;
				this.url.searchParams.set('page', i.toString());
				this.url.searchParams.set('skip', skip.toString());
				const url = this.url.href;
				previous.push({page: i, url});
			}
			this.pagination[ExpressPagination.PREVIOUS] = previous;
		}
	}
	/**
	 *@function
	 */
	private setNext(page: number){
		if(this.totalCount){
			const lastPage = Math.ceil(this.totalCount / this.limit);
			if(lastPage > page){
				const next = [];
				const start = page + 1;
				for (let i = start; start > 0 && i < (start + ExpressPagination.EXTRA_PAGES_ROUND); i++){
					const skip = (i - 1) * this.limit;
					this.url.searchParams.set('page', i.toString());
					this.url.searchParams.set('skip', skip.toString());
					const url = this.url.href;
					next.push({page: i, url});
				}
				this.pagination[ExpressPagination.NEXT] = next;
			}
		}
	}
	/**
	 *@function
	 */
	setProperty(prop: string, value: any){
		this.pagination[prop] = value;
	}
	/**
	 *@function
	 *@return {object} pagination The pagination object
	 */
	done(){
		this.setCurrentPage();
		this.setFirstPage();
		this.setPrevious(this.page);
		this.setNext(this.page);
		this.setLastPage();
		this.pagination['totalCount'] = this.totalCount;
		return this.pagination;
	}

}