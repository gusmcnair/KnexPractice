require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})


function searchItems(searchTerm){
knexInstance
    .select('shopping_list.itemname')
    .from('shopping_list')
    .where('itemname', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
        console.log(result)
    })
}

//searchItems('parody')

function paginateItems(pageNumber){
    const itemsOnPage = 6;
    const offset = itemsOnPage * (pageNumber - 1)
    knexInstance
        .select('shopping_list.itemname', 'price', 'category', 'checked', 'dateadded')
        .from('shopping_list')
        .limit(itemsOnPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

//paginateItems(2)

function getItemsAfterDate(daysAgo){
    knexInstance
        .select('shopping_list.itemname')
        .where('dateadded', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
        .from('shopping_list')
        .groupBy('shopping_list.itemname')
        .then(result => {
            console.log(result)
        })
}

//getItemsAfterDate(8)

function getTotalPrice(){
    let totalPrice = 0;

    knexInstance
        .select('price')
        .from('shopping_list')
        .then(result => {
            for(let i = 0; i < result.length; i++){
                totalPrice += Number(result[i].price)
            }
            console.log(`$${totalPrice}`)
        })
}

getTotalPrice()