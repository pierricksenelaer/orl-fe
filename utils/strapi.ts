import axios from 'axios';
import { Discussion, Reply, StrapiResponse, StrapiData } from '@/types/strapi';

const STRAPI_URL = 'http://127.0.0.1:1337'; // Changed from localhost to 127.0.0.1

export async function fetchDiscussions(): Promise<StrapiResponse<Discussion[]>> {
  try {
    const url = `${STRAPI_URL}/api/discussions?populate=users_permissions_user&populate=replies&sort=updatedAt:desc`;
    console.log('Attempting to fetch from:', url);
    
    const { data } = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Strapi Response:', data);
    return data;
  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      response: axios.isAxiosError(error) ? error.response?.data : undefined,
      status: axios.isAxiosError(error) ? error.response?.status : undefined
    });
    throw error;
  }
}

export async function fetchDiscussion(slug: string): Promise<StrapiResponse<Discussion>> {
  try {
    //const url = `${STRAPI_URL}/api/discussions/${id}?populate=users_permissions_user&populate=replies.users_permissions_user&populate=replies.parent_reply`;
    //const url = `${STRAPI_URL}/api/discussions/${id}?populate[users_permissions_user]=*&populate[replies]=*`;
    // const url = `${STRAPI_URL}/api/discussions/${id}?populate=*`;
    // const url = `${STRAPI_URL}/api/discussions?filters[slug][$eq]=${slug}&populate=*`;
    //const url = `${STRAPI_URL}/api/discussions?filters[slug][$eq]=${slug}&populate[replies][populate][users_permissions_user]=*&populate[users_permissions_user]=*`;
    //const url = `${STRAPI_URL}/api/discussions?filters[slug][$eq]=${slug}&populate[0]=users_permissions_user&populate[1]=replies`;
    //const url = `${STRAPI_URL}/api/discussions?filters[slug][$eq]=${slug}&populate[0]=users_permissions_user&populate[1]=replies&sort[1]=updatedAt:asc`;
    //const url = `${STRAPI_URL}/api/discussions?filters[slug][$eq]=${slug}&populate[0]=users_permissions_user&populate[1]=replies&timestamp=${Date.now()}`;
    //const url = `${STRAPI_URL}/api/discussions?filters[slug][$eq]=${slug}&populate[users_permissions_user][populate]=*&populate[replies][populate]=*`;
    //const url = `${STRAPI_URL}/api/discussions?filters[slug][$eq]=${slug}&populate[users_permissions_user]=*&populate[replies]=*`;
    const url = `${STRAPI_URL}/api/discussions?filters[slug][$eq]=${slug}&populate=*`;
    console.log('Attempting to fetch discussion:', url);
    
    const { data } = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('Single Discussion Response:', data);
    return data;
  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      response: axios.isAxiosError(error) ? error.response?.data : undefined,
      status: axios.isAxiosError(error) ? error.response?.status : undefined
    });
    throw error;
  }
}