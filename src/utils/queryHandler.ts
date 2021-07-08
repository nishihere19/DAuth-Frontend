import { params } from './queryParams';
export function searchQuery() {
  const parameters = new URLSearchParams(window.location.search);
  const newParams = {
    client_id: parameters.get('client_id'),
    redirect_uri: parameters.get('redirect_uri'),
    response_type: 'code',
    grant_type: parameters.get('grant_type'),
    state: parameters.get('state'),
    scope: parameters.get('scope'),
    nonce: parameters.get('nonce')
  };
  params.set(newParams);
  const formBody = [];
  for (const property in newParams) {
    const propertyName: string = property;
    const propertyValue: string = newParams[property];
    formBody.push(`${propertyName}=${propertyValue}`);
  }
  const finalParams = formBody.join('&');
  return finalParams;
}
