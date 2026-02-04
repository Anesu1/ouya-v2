import { sanityClient } from '@/lib/sanity'
import React from 'react'
import { Helmet } from "react-helmet"
import ContactClient from './Client'

export default async function page() {
    const query = `*[_type == "contactUs"][0]{
          title,
          description,
          email,
 } `
  
    const contact = await sanityClient.fetch(query)

  
  return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         
    
          <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-8">{contact.title}</h1>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-600 mb-6">{contact.description}</p>
    
              <div className="mt-8">
                <address className="not-italic text-gray-600">
                  <p className="mt-4">Email: {contact.email}</p>
                </address>
              </div>
            </div>
    
           <ContactClient />
          </div>
        </div>
  )
}
