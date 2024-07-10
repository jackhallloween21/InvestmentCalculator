let calculatorType = 'sip';

        function toggleCalculator(type) {
            calculatorType = type;
            document.querySelectorAll('.calculator').forEach(calc => calc.style.display = 'none');
            document.getElementById(`${type}-calculator`).style.display = 'block';
            document.querySelectorAll('.toggle-switch button').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`${type}-toggle`).classList.add('active');
            calculate();
        }

        function calculate() {
            switch(calculatorType) {
                case 'sip':
                    calculateSIP();
                    break;
                case 'lumpsum':
                    calculateLumpsum();
                    break;
                case 'swp':
                    calculateSWP();
                    break;
            }
        }

        function calculateSIP() {
            const monthlyInvestment = parseFloat(document.getElementById('sip-monthly-investment').value);
            const returnRate = parseFloat(document.getElementById('sip-return-rate').value) / 100 / 12;
            const timePeriod = parseFloat(document.getElementById('sip-time-period').value) * 12;

            const totalInvestment = monthlyInvestment * timePeriod;
            const futureValue = monthlyInvestment * ((Math.pow(1 + returnRate, timePeriod) - 1) / returnRate) * (1 + returnRate);
            const estimatedReturns = futureValue - totalInvestment;

            document.getElementById('sip-invested-amount').textContent = totalInvestment.toLocaleString('en-IN');
            document.getElementById('sip-est-returns').textContent = Math.round(estimatedReturns).toLocaleString('en-IN');

            updateChart('sip-chart', totalInvestment, estimatedReturns);
        }

        function calculateLumpsum() {
            const investment = parseFloat(document.getElementById('lumpsum-investment').value);
            const returnRate = parseFloat(document.getElementById('lumpsum-return-rate').value) / 100;
            const timePeriod = parseFloat(document.getElementById('lumpsum-time-period').value);

            const futureValue = investment * Math.pow(1 + returnRate, timePeriod);
            const estimatedReturns = futureValue - investment;

            document.getElementById('lumpsum-invested-amount').textContent = investment.toLocaleString('en-IN');
            document.getElementById('lumpsum-est-returns').textContent = Math.round(estimatedReturns).toLocaleString('en-IN');

            updateChart('lumpsum-chart', investment, estimatedReturns);
        }

        function calculateSWP() {
            const totalInvestment = parseFloat(document.getElementById('swp-total-investment').value);
            const withdrawalPerMonth = parseFloat(document.getElementById('swp-withdrawal-per-month').value);
            const expectedReturns = parseFloat(document.getElementById('swp-expected-returns').value) / 100;
            const tenure = parseFloat(document.getElementById('swp-tenure').value);

            let balance = totalInvestment;
            for (let i = 0; i < tenure * 12; i++) {
                balance = balance * (1 + expectedReturns / 12) - withdrawalPerMonth;
            }

            const finalValue = Math.max(0, Math.round(balance));
            document.getElementById('swp-final-value').textContent = finalValue.toLocaleString('en-IN');

            updateChart('swp-chart', totalInvestment - finalValue, finalValue);
        }

        function updateChart(chartId, invested, returns) {
            const total = invested + returns;
            const investedPercentage = (invested / total) * 360;
            const returnsPercentage = (returns / total) * 360;
            document.getElementById(chartId).style.background = 
                `conic-gradient(#4285f4 0deg ${investedPercentage}deg, #34a853 ${investedPercentage}deg 360deg)`;
        }

        // Initialize sliders and input boxes
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            const input = document.getElementById(slider.id.replace('-slider', ''));
            slider.addEventListener('input', function() {
                input.value = this.value;
                calculate();
            });
            input.addEventListener('input', function() {
                slider.value = this.value;
                calculate();
            });
        });

        // Initial calculation
        toggleCalculator('sip');
