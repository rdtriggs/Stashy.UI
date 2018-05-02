<template>
  <div class="portfolio-value">
    <div class="portfolio-value-body">
      <div class="portfolio-value-title">
        <img src="../../../static/img/logo-symbol.svg" alt="">
        <h4>Portfolio Value</h4>
      </div>
      <div class="portfolio-value-content">
        <p class="portfolio-value-value">{{ portfolio.value | formatCurrency }}</p>
      </div>
      <div class="portfolio-value-footer">
        <b-button variant="add-asset" block><i class="fa fa-plus" aria-hidden="true"></i>Add Asset</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { formatCurrency, formatPercent } from '../../utils';

  export default {
    name: 'portfolio-value-card',
    props: {
      portfolio: {},
    },
    filters: {
      formatCurrency(value) {
        return formatCurrency(value, false, 'fiat');
      },
      formatPercent(value) {
        return formatPercent(value, true);
      },
    },
  };
</script>
