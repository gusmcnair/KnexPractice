const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`List service object`, function() {
    let db
    let testList = [
        {id: 1, 
        name: 'Donkey liver', 
        price: 99.99, 
        category: 'Snack', 
        checked: false,
        dateAdded: new Date('2029-01-22T16:28:32.615Z')},

        {id: 2, 
        name: 'Chimp liver', 
        price: 99.99, 
        category: 'Lunch', 
        checked: true,
        dateAdded: new Date('2029-01-22T16:28:32.615Z')},

        {id: 3, 
        name: 'Phils liver', 
        price: 99.99, 
        category: 'Breakfast', 
        checked: false,
        dateAdded: new Date('2029-01-22T16:28:32.615Z')},   
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
            }
          )
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given list has data`, () => {

        beforeEach(() =>  {
            return db
            .into('shopping_list')
            .insert(testList)
        })

        it(`getAllItems resolves all data from shopping list table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testList)
                }) 
        })

        it(`getById resolves article by ID`, () => {
            const thirdId = 3
            const thirdTestItem = testList[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
            .then(actual => {
                expect(actual).to.eql({
                    id: thirdId,
                    name: thirdTestItem.name,
                    price: thirdTestItem.price,
                    checked: thirdTestItem.checked,
                    dateAdded: thirdTestItem.dateAdded,
                })
            })
        })

        it(`deleteItem removes an item`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
            .then(() => ShoppingListService.getAllItems(db))
            .then(allItems => {
                const expected = testList.filter(item => item.id != itemId)
                expect(allItems).to.eql(expected)
            })
        })

    })
})