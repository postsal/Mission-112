module.exports = function main(inputs) {
    var datbase=require('./datbase');
    var loadAllItems =datbase.loadAllItems();
    var loadPromotions = datbase.loadPromotions();
    var str = '***<没钱赚商店>购物清单***\n';
    //计算购物清单物品以及数量
    var result = [];
    var app =[];
    //形成购物清单物品以及数量
    for(var i =0;i<inputs.length;i++){
        var item = inputs[i];
        if(item.indexOf('-') !== -1){
            var n =item.substring(0,item.indexOf('-'));
            var c = parseInt(item.substring(item.indexOf('-')+1));
            if(app.indexOf(n) === -1){
                result.push({code:n,count:c});
                app.push(n);
            }else{
                result[app.indexOf(n)].count+=c;
            }
        }else{
            if(app.indexOf(item) === -1){
                result.push({code:item,count:1});
                app.push(item);
            }else{
                result[app.indexOf(item)].count+=1;
            }
        }
    }
    //console.log(result);
    //添加购物清单物品的编码
    for( var i =0 ;i< result.length;i++){
        var item = result[i];
        for(var j =0 ;j< loadAllItems.length ;j++){
            var itemJ = loadAllItems[j];
            if(item.code == itemJ.barcode){
                item.sum = item.count*itemJ.price //未优惠之前，每项物品的金额
                item.unit = itemJ.unit;
                item.price = itemJ.price;
                item.name =itemJ.name;
            }
        }
    }
   //console.log(result);
    
    
    //计算优惠
    for( var i =0 ;i< result.length;i++){
        var item = result[i];
        for(var j =0 ;j< loadPromotions.length ;j++){
            var itemJ = loadPromotions[j];
            var barcodes =itemJ.barcodes;
            if(barcodes.indexOf(item.code) !== -1){
                item.type =itemJ.type;
            }
        }
    }
   // console.log(result);
    
    //打印
    var promotions =0   
    var sum =0;
    for(var i =0 ;i< result.length ;i++){
        var item = result[i];
        sum+=item.price*item.count;
        if(item.type == 'BUY_TWO_GET_ONE_FREE' && item.count >=2){
            var promotion =item.price* (item.count -1);
            promotions +=item.price;
            str += '名称：'+item.name+'，数量：'+item.count+item.unit+'，单价：'+item.price.toFixed(2)+'(元)，小计：'+promotion.toFixed(2)+'(元)\n'
        }else{
            str += '名称：'+item.name+'，数量：'+item.count+item.unit+'，单价：'+item.price.toFixed(2)+'(元)，小计：'+(item.price* item.count).toFixed(2)+'(元)\n'
        }
    }
    
    str+='----------------------\n' +'挥泪赠送商品：\n';
    for(var i =0 ;i< result.length ;i++){
         var item = result[i];
        if(item.type == 'BUY_TWO_GET_ONE_FREE' && item.count >=2){
            str +='名称：'+item.name+'，数量：'+1+item.unit+'\n'
        }
    }
    str+='----------------------\n';
    str+= '总计：'+(sum -promotions).toFixed(2)+'(元)\n';
    str+='节省：'+promotions.toFixed(2)+'(元)\n'
    str+='**********************';
    console.log(str);
};