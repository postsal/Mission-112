const order = require('../main/main');
const datbase = require('../main/datbase');

describe('pos', function () {
    var allItems;
    var promotions;h
    var inputs;

    beforeEach(function () {
        allItems = datbase.loadAllItems();
        promotions = datbase.loadPromotions();
        inputs = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
        ];
    });
    
    it('should create an order', function () {

        var result = order.createOrder(inputs);

        var expectOrder = [ { code: 'ITEM000001', count: 5 }, { code: 'ITEM000003', count: 2 }, { code: 'ITEM000005', count: 3 } ];

        expect(result).toEqual(expectOrder);
    });
    
    it('should add goods information to the order', function () {

        var temp = [ { code: 'ITEM000001', count: 5 }, { code: 'ITEM000003', count: 2 }, { code: 'ITEM000005', count: 3 } ];    

        var result = order.addInfoToOrder(allItems,temp);

        var expectOrder = [ { code: 'ITEM000001', count: 5, sum: 15, unit: '瓶', price: 3, name: '雪碧' },
                            { code: 'ITEM000003', count: 2, sum: 30, unit: '斤', price: 15, name: '荔枝' }, 
                            { code: 'ITEM000005', count: 3, sum: 13.5, unit: '袋', price: 4.5, name: '方便面' } 
                          ];

        expect(result).toEqual(expectOrder);
    });
    
    it('should add goods promotions to the order', function () {

        var temp = [ { code: 'ITEM000001', count: 5, sum: 15, unit: '瓶', price: 3, name: '雪碧' },
                      { code: 'ITEM000003', count: 2, sum: 30, unit: '斤', price: 15, name: '荔枝' }, 
                      { code: 'ITEM000005', count: 3, sum: 13.5, unit: '袋', price: 4.5, name: '方便面' } 
                    ];       

        var result = order.addPromotionsToOrder(promotions,temp);

        var expectOrder = [ { code: 'ITEM000001', count: 5, sum: 15, unit: '瓶', price: 3, name: '雪碧', type: 'BUY_TWO_GET_ONE_FREE' },
                            { code: 'ITEM000003', count: 2, sum: 30, unit: '斤', price: 15, name: '荔枝' }, 
                            { code: 'ITEM000005', count: 3, sum: 13.5, unit: '袋', price: 4.5, name: '方便面', type: 'BUY_TWO_GET_ONE_FREE' } 
                          ];

        expect(result).toEqual(expectOrder);
    });
    

    it('should print correct text', function () {

        spyOn(console, 'log');
        
        var resultOrder = [ { code: 'ITEM000001', count: 5, sum: 15, unit: '瓶', price: 3, name: '雪碧', type: 'BUY_TWO_GET_ONE_FREE' },
                            { code: 'ITEM000003', count: 2, sum: 30, unit: '斤', price: 15, name: '荔枝' }, 
                            { code: 'ITEM000005', count: 3, sum: 13.5, unit: '袋', price: 4.5, name: '方便面', type: 'BUY_TWO_GET_ONE_FREE' } 
                          ];
        
        order.print(resultOrder);

        var expectText =
            '***<没钱赚商店>购物清单***\n' +
            '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
            '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
            '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
            '----------------------\n' +
            '挥泪赠送商品：\n' +
            '名称：雪碧，数量：1瓶\n' +
            '名称：方便面，数量：1袋\n' +
            '----------------------\n' +
            '总计：51.00(元)\n' +
            '节省：7.50(元)\n' +
            '**********************';

        expect(console.log).toHaveBeenCalledWith(expectText);
    });
});
