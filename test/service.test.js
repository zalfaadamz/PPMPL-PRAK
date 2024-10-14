import sinon from 'sinon';
import { expect } from 'chai';
import Service from '../src/service.js';
import PrimaryRepository from '../src/repository.js';
import SecondaryRepository from '../src/secondaryRepository.js';

describe('Service Integration Tests', () => {
  let service;
  let primaryRepositoryStub;
  let secondaryRepositoryStub;

  beforeEach(() => {
    primaryRepositoryStub = sinon.createStubInstance(PrimaryRepository);
    secondaryRepositoryStub = sinon.createStubInstance(SecondaryRepository);
    service = new Service();
    service.primaryRepository = primaryRepositoryStub;
    service.secondaryRepository = secondaryRepositoryStub;
  });

  it('should return an item from the primary repository by id', () => {
    const item = { id: 1, name: 'Item 1' };
    primaryRepositoryStub.getItemById.withArgs(1).returns(item);

    const result = service.getItemById(1);

    expect(result).to.equal(item);
    expect(primaryRepositoryStub.getItemById.calledOnceWith(1)).to.be.true;
    expect(secondaryRepositoryStub.getItemById.notCalled).to.be.true;
  });

  it('should return an item from the secondary repository if not found in the primary', () => {
    primaryRepositoryStub.getItemById.withArgs(3).returns(null);
    const item = { id: 3, name: 'Item 3' };
    secondaryRepositoryStub.getItemById.withArgs(3).returns(item);

    const result = service.getItemById(3);

    expect(result).to.equal(item);
    expect(primaryRepositoryStub.getItemById.calledOnceWith(3)).to.be.true;
    expect(secondaryRepositoryStub.getItemById.calledOnceWith(3)).to.be.true;
  });

  it('should throw an error if item is not found in both repositories', () => {
    primaryRepositoryStub.getItemById.returns(null);
    secondaryRepositoryStub.getItemById.returns(null);

    expect(() => service.getItemById(5)).to.throw('Item not found in both repositories');
    expect(primaryRepositoryStub.getItemById.calledOnceWith(5)).to.be.true;
    expect(secondaryRepositoryStub.getItemById.calledOnceWith(5)).to.be.true;
  });

  it('should return all items from the primary repository', () => {
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ];
    primaryRepositoryStub.getAllItems.returns(items);

    const result = service.getAllItems();

    expect(result).to.equal(items);
    expect(primaryRepositoryStub.getAllItems.calledOnce).to.be.true;
  });

  it('should add a new item to the primary repository', () => {
    primaryRepositoryStub.data = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    const newItem = { id: 3, name: 'Item 3' };
    primaryRepositoryStub.addItem.withArgs(newItem).returns(newItem);

    const result = service.addItem('Item 3');
    expect(result).to.equal(newItem);
    expect(primaryRepositoryStub.addItem.calledOnceWith(newItem)).to.be.true;
  });

  it("should remove an item by id", () => {
    const itemToRemove = { id: 1, name: "Item 1" };
    primaryRepositoryStub.removeItem.withArgs(1).returns(itemToRemove);

    const result = service.primaryRepository.removeItem(1);

    expect(result).to.equal(itemToRemove);
    expect(primaryRepositoryStub.removeItem.calledOnceWith(1)).to.be.true;
  });
});