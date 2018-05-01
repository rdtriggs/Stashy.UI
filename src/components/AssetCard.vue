<template>
  <div class="portfolio-item">
    <div class="portfolio-item-body">
      <div class="portfolio-item-title">
        <img :src="imageUrl(item.id)" v-bind:alt="item.asset.name" @error="imageLoadError">
        <h4>{{ item.asset.name }}
          <small>{{ item.asset.symbol }}</small>
        </h4>
      </div>
      <div class="portfolio-item-content">
        <p class="portfolio-value">{{ item.value_usd | formatCurrency }}</p>
      </div>
      <div class="portfolio-item-footer">
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
  import { formatCurrency, formatPercent } from '../utils';

  export default {
    name: 'asset-card',
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
