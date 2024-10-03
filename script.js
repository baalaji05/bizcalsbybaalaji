document.getElementById('calculation').addEventListener('change', function () {
    const calculation = this.value;
    const inputFields = document.getElementById('inputFields');
    inputFields.innerHTML = ''; // Clear previous input fields

    // Define input fields based on selected calculation
    let fields = [];

    switch (calculation) {
        case 'gross_profit_margin':
            fields = [
                { label: 'Revenue', id: 'revenue' },
                { label: 'Cost of Goods Sold', id: 'cogs' }
            ];
            break;
        case 'net_profit_margin':
            fields = [
                { label: 'Net Income', id: 'net_income' },
                { label: 'Revenue', id: 'revenue' }
            ];
            break;
        case 'operating_profit_margin':
            fields = [
                { label: 'Operating Income', id: 'operating_income' },
                { label: 'Revenue', id: 'revenue' }
            ];
            break;
        case 'roi':
            fields = [
                { label: 'Net Profit', id: 'net_profit' },
                { label: 'Investment Cost', id: 'investment_cost' }
            ];
            break;
        case 'break_even':
            fields = [
                { label: 'Fixed Costs', id: 'fixed_costs' },
                { label: 'Selling Price per Unit', id: 'selling_price' },
                { label: 'Variable Cost per Unit', id: 'variable_cost' }
            ];
            break;
        case 'current_ratio':
            fields = [
                { label: 'Current Assets', id: 'current_assets' },
                { label: 'Current Liabilities', id: 'current_liabilities' }
            ];
            break;
        case 'quick_ratio':
            fields = [
                { label: 'Current Assets', id: 'current_assets' },
                { label: 'Inventory', id: 'inventory' },
                { label: 'Current Liabilities', id: 'current_liabilities' }
            ];
            break;
        case 'debt_to_equity':
            fields = [
                { label: 'Total Debt', id: 'total_debt' },
                { label: 'Total Equity', id: 'total_equity' }
            ];
            break;
        case 'working_capital':
            fields = [
                { label: 'Current Assets', id: 'current_assets' },
                { label: 'Current Liabilities', id: 'current_liabilities' }
            ];
            break;
        case 'roe':
            fields = [
                { label: 'Net Income', id: 'net_income' },
                { label: 'Shareholder\'s Equity', id: 'shareholder_equity' }
            ];
            break;
        case 'inventory_turnover':
            fields = [
                { label: 'Cost of Goods Sold', id: 'cogs' },
                { label: 'Average Inventory', id: 'average_inventory' }
            ];
            break;
        case 'debt_ratio':
            fields = [
                { label: 'Total Liabilities', id: 'total_liabilities' },
                { label: 'Total Assets', id: 'total_assets' }
            ];
            break;
        case 'pe_ratio':
            fields = [
                { label: 'Market Value per Share', id: 'market_value' },
                { label: 'Earnings per Share', id: 'earnings_per_share' }
            ];
            break;
        default:
            break;
    }

    fields.forEach(field => {
        const inputField = document.createElement('div');
        inputField.innerHTML = `
            <label for="${field.id}">${field.label}:</label>
            <input type="number" id="${field.id}" required>
        `;
        inputFields.appendChild(inputField);
    });
});

// Calculate results based on selected calculation
document.getElementById('calculateBtn').addEventListener('click', function () {
    const calculation = document.getElementById('calculation').value;
    const inputs = {};

    const inputFields = document.getElementById('inputFields').getElementsByTagName('input');
    for (const field of inputFields) {
        inputs[field.id] = parseFloat(field.value) || 0; // Default to 0 if empty
    }

    let result;
    switch (calculation) {
        case 'gross_profit_margin':
            result = ((inputs.revenue - inputs.cogs) / inputs.revenue) * 100;
            break;
        case 'net_profit_margin':
            result = (inputs.net_income / inputs.revenue) * 100;
            break;
        case 'operating_profit_margin':
            result = (inputs.operating_income / inputs.revenue) * 100;
            break;
        case 'roi':
            result = (inputs.net_profit / inputs.investment_cost) * 100;
            break;
        case 'break_even':
            result = inputs.fixed_costs / (inputs.selling_price - inputs.variable_cost);
            break;
        case 'current_ratio':
            result = inputs.current_assets / inputs.current_liabilities;
            break;
        case 'quick_ratio':
            result = (inputs.current_assets - inputs.inventory) / inputs.current_liabilities;
            break;
        case 'debt_to_equity':
            result = inputs.total_debt / inputs.total_equity;
            break;
        case 'working_capital':
            result = inputs.current_assets - inputs.current_liabilities;
            break;
        case 'roe':
            result = (inputs.net_income / inputs.shareholder_equity) * 100;
            break;
        case 'inventory_turnover':
            result = inputs.cogs / inputs.average_inventory;
            break;
        case 'debt_ratio':
            result = inputs.total_liabilities / inputs.total_assets;
            break;
        case 'pe_ratio':
            result = inputs.market_value / inputs.earnings_per_share;
            break;
        default:
            result = null;
            break;
    }

    // Display the result
    document.getElementById('result').innerText = result !== null ? `Result: ${result.toFixed(2)}${(calculation === 'current_ratio' || calculation === 'quick_ratio' || calculation === 'debt_to_equity' || calculation === 'debt_ratio') ? '' : '%'}` : 'Invalid calculation';

    // Refresh chart for every new calculation
    if (result !== null) {
        updateChart(result);
    }
});

// Reset fields and chart
document.getElementById('resetBtn').addEventListener('click', function () {
    document.getElementById('inputFields').innerHTML = '';
    document.getElementById('result').innerText = '';
    resetChart();
});

// Chart instance management
let chart;
function updateChart(result) {
    const resultChartCtx = document.getElementById('resultChart').getContext('2d');

    // Destroy previous chart instance (if exists)
    if (chart) {
        chart.destroy();
    }

    const chartData = [result];
    const chartLabels = ['Percentage'];

    chart = new Chart(resultChartCtx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Calculation Result',
                data: chartData,
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Calculation Result'
                }
            }
        }
    });
}

// Reset chart function
function resetChart() {
    if (chart) {
        chart.destroy(); // Destroy the existing chart
        chart = null;    // Reset the chart instance
    }
}
