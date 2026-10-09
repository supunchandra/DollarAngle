// Homepage and listing-page image choices. Reuse this mapping until the CMS provides article thumbnails.
export const articleImages: Record<string,string> = {
 'financial-order-of-operations':'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
 'emergency-fund-without-putting-life-on-hold':'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=900&q=80',
 'what-is-an-etf':'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
 'diversification-before-stock-picking':'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
 'dollar-cost-averaging':'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=900&q=80',
 'compounding-needs-time':'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=900&q=80',
 'rent-vs-buy':'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
 'employer-match-retirement':'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=900&q=80',
 'interest-rates-and-your-money':'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
 'how-to-read-market-headlines':'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80'
};
const categoryFallbacks: Record<string,string> = {
 'personal-finance':'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
 'investing':'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
 'markets':'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80',
 'economy':'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
 'real-estate':'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
 'crypto':'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80'
};
export function articleThumbnail(entry:{id:string,data:{category:string,thumbnailImage?:string}}): string {
 return entry.data.thumbnailImage || articleImages[entry.id] || categoryFallbacks[entry.data.category] ?? categoryFallbacks['personal-finance'];
}
