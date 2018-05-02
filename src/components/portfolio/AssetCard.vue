<template>
  <div class="portfolio-asset">
    <div class="portfolio-asset-body">
      <div class="portfolio-asset-title">
        <img :src="imageUrl(item.id)" v-bind:alt="item.asset.name" @error="imageLoadError">
        <h4>{{ item.asset.name }}
          <small>{{ item.asset.symbol }}</small>
        </h4>
      </div>
      <div class="portfolio-asset-content">
        <p class="portfolio-asset-value">{{ item.value_usd | formatCurrency }}</p>
      </div>
      <div class="portfolio-asset-footer">
        <ul>
          <li>
            <strong>Holdings</strong><br>
            {{ item.amount | formatCurrency }}
          </li>
          <li>
            <strong>Price</strong><br>
            {{ item.price_usd | formatCurrency }}
          </li>
          <li>
            <strong>% Change</strong><br>
            {{ item.percent_change | formatPercent }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { formatCurrency, formatPercent } from '../../utils';

  export default {
    name: 'portfolio-asset-card',
    props: {
      item: {},
    },
    filters: {
      formatCurrency(value) {
        return formatCurrency(value, false, 'fiat');
      },
      formatPercent(value) {
        return formatPercent(value, true);
      },
    },
    methods: {
      imageUrl(id) {
        return `../static/icons/${id}.png`;
      },
      imageLoadError(e) {
        e.target.src = '../static/icons/bitcoin.png';
      },
    },
  };
</script>
