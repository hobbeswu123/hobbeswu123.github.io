// 购物车数据
let cart = [];

// DOM 元素
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const priceCloseBtn = document.getElementById('priceCloseBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const goToPaymentBtn = document.getElementById('goToPaymentBtn');
const paymentModal = document.getElementById('paymentModal');
const closePaymentBtn = document.getElementById('closePaymentBtn');
const orderItems = document.getElementById('orderItems');
const subtotal = document.getElementById('subtotal');
const finalTotal = document.getElementById('finalTotal');
const submitOrderBtn = document.getElementById('submitOrderBtn');
const successModal = document.getElementById('successModal');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const orderHistoryBtn = document.getElementById('orderHistoryBtn');
const paymentOptions = document.querySelectorAll('input[name="payment"]');

// 打开购物车侧边栏
function openCart() {
    cartSidebar.classList.remove('translate-x-full');
    document.body.classList.add('overflow-hidden');
}

// 关闭购物车侧边栏
function closeCart() {
    cartSidebar.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
}

// 打开支付模态框
function openPayment() {
    paymentModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    updateOrderSummary();
}

// 关闭支付模态框
function closePayment() {
    paymentModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

// 打开成功模态框
function openSuccess() {
    successModal.classList.remove('hidden');
}

// 关闭成功模态框
function closeSuccess() {
    successModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    // 清空购物车
    cart = [];
    updateCart();
    updateOrderSummary();
}

// 添加商品到购物车
function addToCart(productId, productName, productPrice) {
    // 检查商品是否已在购物车中
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // 增加商品数量
        existingItem.quantity += 1;
    } else {
        // 添加新商品
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    // 更新购物车
    updateCart();
    
    // 显示添加成功提示
    showToast(`${productName} 已添加到购物车`);
}

// 从购物车中移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// 更新购物车数量
function updateItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCart();
        }
    }
}

// 更新购物车显示
function updateCart() {
    // 更新购物车计数
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // 更新购物车内容
    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartItems.innerHTML = '';
        checkoutBtn.disabled = true;
        cartTotal.textContent = '¥0';
    } else {
        emptyCart.classList.add('hidden');
        cartItems.innerHTML = '';
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'flex justify-between items-center py-3 border-b';
            itemElement.innerHTML = `
                <div class="flex items-center">
                    <img src="https://picsum.photos/id/${item.id}/60/60" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                    <div>
                        <h4 class="font-medium">${item.name}</h4>
                        <p class="text-primary font-bold">¥${item.price.toLocaleString()}</p>
                    </div>
                </div>
                <div class="flex items-center">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input mx-2 w-12 text-center" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn text-red-500 hover:text-red-700" data-id="${item.id}">
                    <i class="fa fa-trash"></i>
                </button>
            `;
            
            cartItems.appendChild(itemElement);
        });
        
        // 更新总价
        cartTotal.textContent = `¥${total.toLocaleString()}`;
        checkoutBtn.disabled = false;
        
        // 添加数量按钮事件监听
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
                let newQuantity = parseInt(input.value);
                
                if (this.classList.contains('plus')) {
                    newQuantity++;
                } else if (this.classList.contains('minus')) {
                    newQuantity--;
                }
                
                updateItemQuantity(productId, newQuantity);
            });
        });
        
        // 添加数量输入框事件监听
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = this.getAttribute('data-id');
                let newQuantity = parseInt(this.value);
                
                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1;
                }
                
                updateItemQuantity(productId, newQuantity);
            });
        });
        
        // 添加移除按钮事件监听
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
    }
}

// 更新订单摘要
function updateOrderSummary() {
    if (cart.length === 0) {
        orderItems.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                您的购物车中没有商品
            </div>
        `;
        subtotal.textContent = '¥0';
        finalTotal.textContent = '¥0';
    } else {
        orderItems.innerHTML = '';
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'flex justify-between items-center p-4 border-b';
            itemElement.innerHTML = `
                <div class="flex items-center">
                    <img src="https://picsum.photos/id/${item.id}/60/60" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                    <div>
                        <h4 class="font-medium">${item.name}</h4>
                        <p class="text-gray-500">数量: ${item.quantity}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-primary font-bold">¥${item.price.toLocaleString()}</p>
                </div>
            `;
            
            orderItems.appendChild(itemElement);
        });
        
        // 更新金额
        subtotal.textContent = `¥${total.toLocaleString()}`;
        finalTotal.textContent = `¥${total.toLocaleString()}`;
    }
}

// 显示提示信息
function showToast(message) {
    // 检查是否已存在toast元素
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        // 创建toast元素
        toast = document.createElement('div');
        toast.className = 'toast fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-y-10 opacity-0 transition-all duration-300';
        document.body.appendChild(toast);
    }
    
    // 设置消息内容
    toast.textContent = message;
    
    // 显示toast
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);
    
    // 3秒后隐藏toast
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
    }, 3000);
}

// 提交订单
function submitOrder() {
    if (cart.length === 0) {
        showToast('请先添加商品到购物车');
        return;
    }
    
    // 获取用户选择的支付方式
    const selectedPayment = document.querySelector('input[name="payment"]:checked').id;
    const paymentMethod = {
        'payment1': '支付宝',
        'payment2': '微信支付',
        'payment3': '银联支付'
    }[selectedPayment];
    
    // 在实际应用中，这里会发送订单数据到服务器
    // 这里仅做演示
    
    // 关闭支付模态框
    closePayment();
    
    // 显示对应支付方式的支付页面
    showPaymentPage(paymentMethod);
}

// 显示支付方式页面
function showPaymentPage(paymentMethod) {
    // 创建支付页面模态框
    let paymentPageModal = document.getElementById('paymentPageModal');
    
    if (!paymentPageModal) {
        paymentPageModal = document.createElement('div');
        paymentPageModal.id = 'paymentPageModal';
        paymentPageModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        document.body.appendChild(paymentPageModal);
    }
    
    // 设置支付页面内容
    const totalAmount = finalTotal.textContent;
    
    let paymentIcon = 'fa-credit-card';
    let paymentColor = 'text-blue-500';
    
    if (paymentMethod === '微信支付') {
        paymentIcon = 'fa-credit-card';
        paymentColor = 'text-green-500';
    } else if (paymentMethod === '银联支付') {
        paymentIcon = 'fa-credit-card';
        paymentColor = 'text-purple-500';
    }
    
    paymentPageModal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-md p-8">
            <div class="text-center mb-6">
                <i class="fa ${paymentIcon} text-5xl ${paymentColor} mb-4"></i>
                <h3 class="text-2xl font-bold">${paymentMethod}</h3>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg mb-6 text-center">
                <p class="text-gray-600 mb-2">订单金额</p>
                <p class="text-3xl font-bold text-primary">${totalAmount}</p>
            </div>
            
            <div class="mb-6">
                <p class="text-gray-600 mb-4">请使用${paymentMethod}扫描下方二维码完成支付</p>
                <div class="flex justify-center">
                    <div class="w-48 h-48 bg-white p-2 border rounded-lg flex items-center justify-center">
                        <!-- 随机生成一个看起来像二维码的图片 -->
                        <img src="https://picsum.photos/id/${Math.floor(Math.random() * 100)}/180/180" alt="支付二维码" class="w-full h-full object-cover">
                    </div>
                </div>
            </div>
            
            <div class="flex space-x-4">
                <button id="closePaymentPageBtn" class="btn-outline flex-1">取消</button>
                <button id="confirmPaymentBtn" class="btn-primary flex-1">已完成支付</button>
            </div>
        </div>
    `;
    
    // 添加事件监听器
    document.getElementById('closePaymentPageBtn').addEventListener('click', function() {
        paymentPageModal.remove();
        document.body.classList.remove('overflow-hidden');
    });
    
    document.getElementById('confirmPaymentBtn').addEventListener('click', function() {
        paymentPageModal.remove();
        openSuccess();
    });
    
    // 点击模态框外部关闭
    paymentPageModal.addEventListener('click', function(event) {
        if (event.target === paymentPageModal) {
            paymentPageModal.remove();
            document.body.classList.remove('overflow-hidden');
        }
    });
    
    document.body.classList.add('overflow-hidden');
}

// 添加事件监听器
// 初始化事件监听
// 购物车按钮点击事件
if (cartBtn) {
    cartBtn.addEventListener('click', openCart);
}

// 关闭购物车按钮点击事件
if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
}

// 关闭价格筛选按钮点击事件
if (priceCloseBtn) {
    priceCloseBtn.addEventListener('click', function() {
        this.closest('div').classList.add('hidden');
    });
}

// 结算按钮点击事件
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', openPayment);
}

// 关闭支付模态框按钮点击事件
if (closePaymentBtn) {
    closePaymentBtn.addEventListener('click', closePayment);
}

// 前往支付按钮点击事件
if (goToPaymentBtn) {
    goToPaymentBtn.addEventListener('click', function() {
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        if (!selectedPayment) {
            showToast('请选择支付方式');
            return;
        }
        submitOrder();
    });
}

// 提交订单按钮点击事件
if (submitOrderBtn) {
    submitOrderBtn.addEventListener('click', submitOrder);
}

// 关闭成功模态框按钮点击事件
if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeSuccess);
}

// 订单历史按钮点击事件
if (orderHistoryBtn) {
    orderHistoryBtn.addEventListener('click', function() {
        window.location.href = 'order-page.html';
    });
}

// 支付方式选择事件
paymentOptions.forEach(option => {
    option.addEventListener('change', function() {
        // 移除所有选中样式
        paymentOptions.forEach(opt => {
            opt.closest('div').classList.remove('border-primary', 'bg-primary/5');
        });
        // 添加选中样式
        this.closest('div').classList.add('border-primary', 'bg-primary/5');
    });
});

// 为所有添加到购物车按钮添加事件监听
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('[data-id]');
        const productId = card.getAttribute('data-id');
        const productName = card.getAttribute('data-name');
        const productPrice = parseInt(card.getAttribute('data-price'));
        
        addToCart(productId, productName, productPrice);
    });
});

// 点击购物车外部关闭购物车
document.addEventListener('click', function(event) {
    if (event.target === cartSidebar) {
        closeCart();
    }
});

// 点击支付模态框外部关闭支付模态框
document.addEventListener('click', function(event) {
    if (event.target === paymentModal) {
        closePayment();
    }
});

// 点击成功模态框外部关闭成功模态框
document.addEventListener('click', function(event) {
    if (event.target === successModal) {
        closeSuccess();
    }
});

// 显卡售卖大厅功能

// 显示提示信息
function showToast(message, duration = 3000) {
    // 检查是否已存在toast元素
    let toast = document.getElementById('toast');
    
    if (toast) {
        // 如果存在，移除它
        toast.remove();
    }
    
    // 创建新的toast元素
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 opacity-0';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 显示toast
    setTimeout(() => {
        toast.classList.remove('opacity-0');
        toast.classList.add('opacity-100');
    }, 10);
    
    // 设置自动隐藏
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// 联系购买按钮点击事件
const buyFromSellerBtns = document.querySelectorAll('.buy-from-seller');
buyFromSellerBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.rounded-xl');
        const sellerName = card.querySelector('h3').textContent;
        const productName = card.querySelector('h4').textContent;
        
        showToast(`正在连接到卖家 ${sellerName}...`);
        
        // 模拟联系卖家的延迟
        setTimeout(() => {
            showToast(`已成功联系卖家 ${sellerName}，请等待回复`);
        }, 1500);
    });
});

// 查看完整号码按钮点击事件
const viewPhoneBtns = document.querySelectorAll('.text-primary.ml-2');
viewPhoneBtns.forEach(btn => {
    btn.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const phoneElement = this.parentNode;
        const originalText = phoneElement.innerHTML;
        
        // 模拟显示完整号码
        const randomPhone = generateRandomPhone();
        phoneElement.innerHTML = randomPhone;
        
        showToast('已显示完整手机号码');
        
        // 3秒后恢复隐藏状态
        setTimeout(() => {
            phoneElement.innerHTML = originalText;
        }, 3000);
    });
});

// 生成随机手机号码
function generateRandomPhone() {
    const prefixes = ['138', '139', '137', '136', '135', '134', '159', '158'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let suffix = '';
    for (let i = 0; i < 8; i++) {
        suffix += Math.floor(Math.random() * 10);
    }
    return `${prefix}${suffix}`;
}

// 加载更多按钮点击事件
const loadMoreBtn = document.getElementById('loadMoreSellers');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
        // 显示加载状态
        this.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i> 加载中...';
        this.disabled = true;
        
        // 模拟加载延迟
        setTimeout(() => {
            // 生成更多卖家信息
            const marketplaceGrid = document.querySelector('#marketplace .grid');
            
            // 随机生成2-4个新的卖家卡片
            const count = Math.floor(Math.random() * 3) + 2;
            
            for (let i = 0; i < count; i++) {
                const sellerCard = createSellerCard(i);
                marketplaceGrid.appendChild(sellerCard);
            }
            
            // 恢复按钮状态
            this.innerHTML = '加载更多';
            this.disabled = false;
            
            // 为新添加的卡片绑定事件
            bindNewSellerCards();
            
            showToast(`已加载 ${count} 条新的显卡销售信息`);
        }, 2000);
    });
}

// 创建新的卖家卡片
function createSellerCard(index) {
    const sellerNames = ['陈大明', '吴小花', '刘小刚', '周小红', '郑小明'];
    const products = [
        {name: 'NVIDIA GeForce RTX 3090', price: 9500, condition: '九成新', warranty: '9个月', location: '成都市锦江区'},
        {name: 'NVIDIA GeForce RTX 3080 Ti', price: 6800, condition: '八成新', warranty: '5个月', location: '杭州市西湖区'},
        {name: 'NVIDIA GeForce RTX 3070', price: 3600, condition: '八成新', warranty: '7个月', location: '武汉市江汉区'},
        {name: 'NVIDIA GeForce RTX 2080 Ti', price: 4200, condition: '七成新', warranty: '已过保', location: '重庆市渝中区'},
        {name: 'NVIDIA GeForce GTX 1660 Ti', price: 1500, condition: '九成新', warranty: '10个月', location: '南京市鼓楼区'}
    ];
    
    const randomIndex = Math.floor(Math.random() * sellerNames.length);
    const product = products[Math.floor(Math.random() * products.length)];
    const sellerName = sellerNames[randomIndex];
    const rating = (3 + Math.random() * 2).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 20) + 5;
    const daysAgo = Math.floor(Math.random() * 10) + 1;
    const deliveryOptions = ['本地交易', '全国包邮', '本地交易/邮寄'];
    const delivery = deliveryOptions[Math.floor(Math.random() * deliveryOptions.length)];
    
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl overflow-hidden shadow-md p-6';
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex items-center">
                <img src="https://picsum.photos/id/${70 + index}/40/40" alt="卖家头像" class="w-10 h-10 rounded-full object-cover mr-3">
                <div>
                    <h3 class="font-bold">${sellerName}</h3>
                    <div class="flex text-yellow-400 text-xs">
                        ${generateStars(rating)}
                        <span class="ml-1 text-gray-500">${rating} (${reviewCount}条评价)</span>
                    </div>
                </div>
            </div>
            <span class="text-xs text-gray-500">发布于 ${daysAgo}天前</span>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div class="sm:col-span-1">
                <img src="https://picsum.photos/id/${10 + index}/200/200" alt="${product.name}" class="w-full h-40 object-cover rounded-lg">
            </div>
            <div class="sm:col-span-2">
                <h4 class="text-xl font-bold mb-2">${product.name}</h4>
                <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">${product.condition}</span>
                    <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">剩余保修: ${product.warranty}</span>
                    <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">${delivery}</span>
                </div>
                <p class="text-gray-600 text-sm mb-3">性能良好，正常使用，性价比高，欢迎咨询。</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-primary">¥${product.price}</span>
                    <button class="buy-from-seller btn-primary py-1 px-4 text-sm">联系购买</button>
                </div>
            </div>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center text-sm text-gray-600 mb-2">
                <i class="fa fa-map-marker mr-2 text-gray-500"></i>
                <span>${product.location}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <i class="fa fa-phone mr-2 text-gray-500"></i>
                <span>${generateRandomPhone().substring(0, 3)}****${generateRandomPhone().substring(7)} <button class="text-primary ml-2">查看完整号码</button></span>
            </div>
        </div>
    `;
    
    return card;
}

// 生成星级评分
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fa fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fa fa-star-half-o"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="fa fa-star-o"></i>';
    }
    
    return starsHtml;
}

// 为新加载的卖家卡片绑定事件
function bindNewSellerCards() {
    // 为新添加的联系购买按钮绑定事件
    const newBuyBtns = document.querySelectorAll('.buy-from-seller:not(.bound)');
    newBuyBtns.forEach(btn => {
        btn.classList.add('bound');
        btn.addEventListener('click', function() {
            const card = this.closest('.rounded-xl');
            const sellerName = card.querySelector('h3').textContent;
            const productName = card.querySelector('h4').textContent;
            
            showToast(`正在连接到卖家 ${sellerName}...`);
            
            // 模拟联系卖家的延迟
            setTimeout(() => {
                showToast(`已成功联系卖家 ${sellerName}，请等待回复`);
            }, 1500);
        });
    });
    
    // 为新添加的查看号码按钮绑定事件
    const newPhoneBtns = document.querySelectorAll('.text-primary.ml-2:not(.bound)');
    newPhoneBtns.forEach(btn => {
        btn.classList.add('bound');
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const phoneElement = this.parentNode;
            const originalText = phoneElement.innerHTML;
            
            // 模拟显示完整号码
            const randomPhone = generateRandomPhone();
            phoneElement.innerHTML = randomPhone;
            
            showToast('已显示完整手机号码');
            
            // 3秒后恢复隐藏状态
            setTimeout(() => {
                phoneElement.innerHTML = originalText;
            }, 3000);
        });
    });
}

// 初始化
updateCart();