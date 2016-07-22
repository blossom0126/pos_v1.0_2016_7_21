'use strict';

describe('pos', () => {

    describe('getItemAmount', ()=> {
        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];
        it('should get "amount" of items', ()=> {
            const itemsAmount = getItemAmount(tags);
            const expectedItemsAmount = [
                {
                    barcode: 'ITEM000001',
                    count: 5
                },
                {
                    barcode: 'ITEM000003',
                    count: 2.5
                },
                {
                    barcode: 'ITEM000005',
                    count: 3
                }
            ];
            expect(itemsAmount).toEqual(expectedItemsAmount);

        });
    });

    describe('getPromotionItems', ()=> {
        const promotions = [
            {
                type: 'BUY_TWO_GET_ONE_FREE',
                barcodes: [
                    'ITEM000000',
                    'ITEM000001',
                    'ITEM000005'
                ]
            }
        ];
        const itemsAmount = [
            {
                barcode: 'ITEM000001',
                count: 5
            },
            {
                barcode: 'ITEM000003',
                count: 2.5
            },
            {
                barcode: 'ITEM000005',
                count: 3
            }];
        it('should get "promotion" of items', ()=> {
            const promotionItems = getPromotionItems(promotions, itemsAmount);
            const expectedpromotionItems = [
                {
                    barcode: 'ITEM000001',
                    count: 5,
                    type: 'BUY_TWO_GET_ONE_FREE'
                },
                {
                    barcode: 'ITEM000003',
                    count: 2.5,
                    type: null
                },
                {
                    barcode: 'ITEM000005',
                    count: 3,
                    type: 'BUY_TWO_GET_ONE_FREE'
                }
            ];
            expect(promotionItems).toEqual(expectedpromotionItems);
        });
    });

    describe('calculatePrimalSubtotal', ()=> {
        const allItems = [
            {
                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00
            },
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00
            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00
            },
            {
                barcode: 'ITEM000004',
                name: '电池',
                unit: '个',
                price: 2.00
            },
            {
                barcode: 'ITEM000005',
                name: '方便面',
                unit: '袋',
                price: 4.50
            }
        ];
        const itemsAmount = [
            {
                barcode: 'ITEM000001',
                count: 5
            },
            {
                barcode: 'ITEM000003',
                count: 2.5
            },
            {
                barcode: 'ITEM000005',
                count: 3
            }];
        const promotionItems = [
            {
                barcode: 'ITEM000001',
                count: 5,
                type: 'BUY_TWO_GET_ONE_FREE'
            },
            {
                barcode: 'ITEM000003',
                count: 2.5,
                type: null
            },
            {
                barcode: 'ITEM000005',
                count: 3,
                type: 'BUY_TWO_GET_ONE_FREE'
            }
        ];
        it('should calculate "primalSubtotal" of items', ()=> {
            const primalSubtotal = calculatePrimalSubtotal(allItems, itemsAmount,promotionItems);
            const expectedprimalSubtotal = [
                {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    count: 5,
                    primalSubtotal:15.00,
                    type: 'BUY_TWO_GET_ONE_FREE'
                },
                {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    count: 2.5,
                    primalSubtotal:37.50,
                    type: null
                },
                {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50,
                    count: 3,
                    primalSubtotal:13.50,
                    type: 'BUY_TWO_GET_ONE_FREE'
                }
            ];
            expect(primalSubtotal).toEqual(expectedprimalSubtotal);
        });
    });

    describe('calculatePromotionSubtotal', ()=> {

        const primalSubtotal = [
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00,
                count: 5,
                primalSubtotal:15.00,
                type: 'BUY_TWO_GET_ONE_FREE'
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2.5,
                primalSubtotal:37.50,
                type: null
            },
            {
                barcode: 'ITEM000005',
                name: '方便面',
                unit: '袋',
                price: 4.50,
                count: 3,
                primalSubtotal:13.50,
                type: 'BUY_TWO_GET_ONE_FREE'
            }
        ];
        it('should calculate "promotionSubtotal" of items', ()=> {
            const promotionSubtotal = calculatePromotionSubtotal(primalSubtotal);
            const expectedpromotionSubtotal = [
                {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    count: 5,
                    primalSubtotal:15.00,
                    promotionSubtotal:12.00,
                    type: 'BUY_TWO_GET_ONE_FREE'
                },
                {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    count: 2.5,
                    primalSubtotal:37.50,
                    promotionSubtotal:37.50,
                    type: null
                },
                {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50,
                    count: 3,
                    primalSubtotal:13.50,
                    promotionSubtotal:9.00,
                    type: 'BUY_TWO_GET_ONE_FREE'
                }
            ];
            expect(promotionSubtotal).toEqual(expectedpromotionSubtotal);
        });
    });

    describe('calculateTotal', ()=> {
        const promotionSubtotal =[{
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00,
            count: 5,
            primalSubtotal:15.00,
            promotionSubtotal:12.00,
            type: 'BUY_TWO_GET_ONE_FREE'
        },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00,
                count: 2.5,
                primalSubtotal:37.50,
                promotionSubtotal:37.50,
                type: null
            },
            {
                barcode: 'ITEM000005',
                name: '方便面',
                unit: '袋',
                price: 4.50,
                count: 3,
                primalSubtotal:13.50,
                promotionSubtotal:9.00,
                type: 'BUY_TWO_GET_ONE_FREE'
            }
        ];
        it('should calculate "total" of items', ()=> {
            const total = calculateTotal(promotionSubtotal);
            const expectedtotal = [
                {
                    primalTotal:66.00,
                    promotionTotal: 58.50
                }
            ];
            expect(total).toEqual(expectedtotal);
        });
    });

    describe('calculateSaveTotal', ()=> {
        const total = [
            {
                primalTotal:66.00,
                promotionTotal: 58.50
            }
        ];
        it('should calculate "savetotal" of items', ()=> {
            const saveTotal = calculateSaveTotal(total);
            const expectedsaveTotal = 7.50;
            expect(saveTotal).toEqual(expectedsaveTotal);
        });
    });

    it('should print text', () => {

        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];

        spyOn(console, 'log');

        printReceipt(tags);

        const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

        expect(console.log).toHaveBeenCalledWith(expectText);
    });


});
