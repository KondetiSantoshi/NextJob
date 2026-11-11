export const resolveCompanyLogo = (
  companyName?: string,
  explicitLogo?: string | null,
  nestedLogo?: string | null
): string => {
  const candidates = [explicitLogo, nestedLogo].filter(
    (logo): logo is string => Boolean(logo) && !logo!.includes('dicebear')
  );
  if (candidates.length > 0) {
    return candidates[0];
  }

  const lowerName = (companyName || '').toLowerCase();
  if (lowerName.includes('google')) return '/logos/google.svg';
  if (lowerName.includes('tcs') || lowerName.includes('tata')) return '/logos/tcs.svg';
  if (lowerName.includes('infosys')) return '/logos/infosys.svg';
  if (lowerName.includes('wipro')) return '/logos/wipro.svg';
  if (lowerName.includes('accenture')) return '/logos/accenture.svg';
  if (lowerName.includes('capgemini')) return '/logos/capgemini.svg';
  if (lowerName.includes('deloitte')) return '/logos/deloitte.svg';
  if (lowerName.includes('ltimindtree') || lowerName.includes('mindtree') || lowerName.includes('lti')) return '/logos/ltimindtree.svg';
  if (lowerName.includes('swiggy')) return '/logos/swiggy.svg';
  if (lowerName.includes('zomato') || lowerName.includes('blinkit')) return '/logos/zomato.svg';
  if (lowerName.includes('flipkart')) return '/logos/flipkart.svg';
  if (lowerName.includes('phonepe')) return '/logos/phonepe.svg';
  if (lowerName.includes('razorpay')) return '/logos/razorpay.svg';
  if (lowerName.includes('cred')) return '/logos/cred.svg';
  if (lowerName.includes('jio') || lowerName.includes('reliance')) return '/logos/jio.svg';
  if (lowerName.includes('amazon')) return '/logos/amazon.svg';
  if (lowerName.includes('microsoft')) return '/logos/microsoft.svg';
  if (lowerName.includes('meta') || lowerName.includes('facebook')) return '/logos/meta.svg';
  if (lowerName.includes('apple')) return '/logos/apple.svg';
  if (lowerName.includes('netflix')) return '/logos/netflix.svg';
  if (lowerName.includes('uber')) return '/logos/uber.svg';
  if (lowerName.includes('stripe')) return '/logos/stripe.svg';
  if (lowerName.includes('nvidia')) return '/logos/nvidia.svg';
  if (lowerName.includes('adobe')) return '/logos/adobe.svg';
  if (lowerName.includes('salesforce')) return '/logos/salesforce.svg';
  if (lowerName.includes('atlassian')) return '/logos/atlassian.svg';
  if (lowerName.includes('hcl')) return '/logos/hcl.svg';
  if (lowerName.includes('cognizant')) return '/logos/cognizant.svg';
  if (lowerName.includes('zoho')) return '/logos/zoho.svg';
  if (lowerName.includes('freshworks')) return '/logos/freshworks.svg';
  if (lowerName.includes('paytm')) return '/logos/paytm.svg';
  if (lowerName.includes('zepto')) return '/logos/zepto.svg';
  if (lowerName.includes('zerodha')) return '/logos/zerodha.svg';
  if (lowerName.includes('groww')) return '/logos/groww.svg';
  if (lowerName.includes('meesho')) return '/logos/meesho.svg';
  if (lowerName.includes('lenskart')) return '/logos/lenskart.svg';
  if (lowerName.includes('hdfc')) return '/logos/hdfc.svg';
  if (lowerName.includes('icici')) return '/logos/icici.svg';
  if (lowerName.includes('walmart')) return '/logos/walmart.svg';
  if (lowerName.includes('tech mahindra')) return '/logos/techmahindra.svg';

  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(companyName || 'Company')}`;
};
