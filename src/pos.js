'use strict';
function getItemAmount(tags) {
    let itemsAmount = [];

    function formatTags(tags) {
        return tags.map(item=> {
            let arrTags = item.split('-');
            return {
                barcode: arrTags[0],
                count: parseFloat(arrTags[1]) || 1
            }
        });
    }

    let formatedTags = formatTags(tags);

    function mergeBarcodes(formatedTags) {
        let result = formatedTags.reduce((cur, newval)=> {
            let exist = cur.find(item=> {
                return item.barcode === newval.barcode;
            });
            if (exist) {
                exist.count += newval.count;
            } else {
                cur.push(Object.assign({}, newval))
            }
            return cur;
        }, []);
        return result;
    }

    itemsAmount = mergeBarcodes(formatedTags);
    return itemsAmount;
}

function getPromotionItems(promotions, itemsAmount) {
    let promotionItems = [];
    for (let i = 0; i < itemsAmount.length; i++) {
        {
            let promotion = promotions.find
            (promotion => promotion.barcodes.some(b => b === itemsAmount[i].barcode));
            let type = promotion ? promotion.type : null;
            promotionItems.push(Object.assign({}, itemsAmount[i], {type: type}));
        }
    }
    return promotionItems;
}

function calculatePrimalSubtotal(allItems, itemsAmount, promotionItems) {
    let primalSubtotal = [];
    let primalItems = [];
    let primalItemstype = [];
    for (let i = 0; i < itemsAmount.length; i++) {
        for (let j = 0; j < allItems.length; j++)
            if (allItems[j].barcode === itemsAmount[i].barcode) {
                primalItems.push(Object.assign({}, allItems[j], {count: itemsAmount[i].count}));
            }
    }
    for (let i = 0; i < promotionItems.length; i++) {
        primalItemstype.push(Object.assign({}, primalItems[i], {type: promotionItems[i].type}));
    }
    for (let i = 0; i < primalItems.length; i++) {
        primalSubtotal.push(Object.assign({}, primalItemstype[i], {primalSubtotal: (primalItems[i].price * primalItems[i].count)}));
    }
    return primalSubtotal;
}

function calculatePromotionSubtotal(primalSubtotal) {
    let promotionSubtotal = [];
    let promotionArr = [];
    for (let i = 0; i < primalSubtotal.length; i++) {
        let promtioncount = parseInt(primalSubtotal[i].count / 3);
        if (primalSubtotal[i].type === 'BUY_TWO_GET_ONE_FREE') {
            promotionArr[i] = parseFloat((primalSubtotal[i].count - promtioncount) * primalSubtotal[i].price);
        }
        else {
            promotionArr[i] = primalSubtotal[i].primalSubtotal;
        }
        promotionSubtotal.push(Object.assign({}, primalSubtotal[i], {promotionSubtotal: promotionArr[i]}))
    }
    return promotionSubtotal;
}

function calculateTotal(promotionSubtotal) {
    let total = [];
    let promotionTotal = 0;
    let primalTotal = 0;
    for (let i = 0; i < promotionSubtotal.length; i++) {
        primalTotal += promotionSubtotal[i].primalSubtotal;
        promotionTotal += promotionSubtotal[i].promotionSubtotal;
    }
    total.push(Object.assign({primalTotal: primalTotal}, {promotionTotal: promotionTotal}));
    return total;
}

function calculateSaveTotal(total) {
    let saveTotal = total[0].primalTotal - total[0].promotionTotal;
    return saveTotal;
}

function print(promotionSubtotal, total, saveTotal) {
    let header = '***<没钱赚商店>收据***\n';
    let footer = '----------------------\n' +
        '总计：' + total[0].promotionTotal.toFixed(2) + '(元)\n' +
        '节省：' + saveTotal.toFixed(2) + '(元)\n' +
        '**********************';
    let body = '';
    let receipt = '';
    for (let item of promotionSubtotal) {
        let itemReceipt = '名称：' + item.name +
            '，数量：' + item.count + item.unit +
            '，单价：' + item.price.toFixed(2) +
            '(元)，小计：' + item.promotionSubtotal.toFixed(2) + '(元)\n';
        body = body.concat(itemReceipt);
    }
    receipt = receipt.concat(header).concat(body).concat(footer);
    return receipt;
}

function printReceipt(tags) {
    let allItems = loadAllItems();
    let promotions = loadPromotions();
    let itemsAmount = getItemAmount(tags);
    let promotionItems = getPromotionItems(promotions, itemsAmount);
    let primalSubtotal = calculatePrimalSubtotal(allItems, itemsAmount, promotionItems);
    let promotionSubtotal = calculatePromotionSubtotal(primalSubtotal);
    let total = calculateTotal(promotionSubtotal);
    let saveTotal = calculateSaveTotal(total);
    let receipt = print(promotionSubtotal, total, saveTotal);
    console.log(receipt);
}

