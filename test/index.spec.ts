import {expect} from 'chai';
import ExpressPagination from '../src/Pagination';
import data from './data.seed';

describe('Express Pagination', () => {
	let pagination: ExpressPagination;
    it('Throws error without options', () => {
    	expect(() => {
			pagination = new ExpressPagination(null);
		}).to.throw(Error);
    });

    it('Throws error without url property in options', () => {
		expect(() => {
			pagination = new ExpressPagination({});
		}).to.throw(Error);
	});

	it('Throws error url options property is not valid', () => {
		expect(() => {
			pagination = new ExpressPagination({url: 'http://localhost:..'});
		}).to.throw(Error);
	});

	it(`Expects total count to be ${data.length}`, () => {
		const options = {url: 'http://localhost:3000', totalCount: data.length};
		pagination = new ExpressPagination(options);
		expect(pagination.totalCount).to.equal(data.length);
		pagination.totalCount = 50;
		expect(pagination.totalCount).to.be.lessThan(data.length);
	});

	it(`Expects pagination object`, () => {
		const options = {url: 'http://localhost:3000?page=3&limit=10'};
		pagination = new ExpressPagination(options);
		pagination.totalCount = data.length;
		console.log('pagination ', pagination.done());
	});

});
