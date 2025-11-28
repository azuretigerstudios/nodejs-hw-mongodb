import  {Contact}  from '../db/models/contact.model.js';

export const getAllContacts = async ({ 
  page, 
  perPage, 
  sortBy, 
  sortOrder, 
  contactType, 
  isFavourite 
}) => {
  
  // Filtreleme Kriterlerini Oluşturma (Adım 5)
  const filter = {};
  
  // contactType filtresi
  if (contactType) {
    filter.contactType = contactType;
  }
  
  // isFavourite filtresi (false veya true olabilir, bu yüzden undefined kontrolü önemli)
  if (isFavourite !== undefined) { 
      filter.isFavourite = isFavourite;
  }
  
  // Sıralama Kriterini Oluşturma (Adım 4)
  // Mongoose sort objesi: { [alan]: 1 (asc) veya -1 (desc) }
  const sort = { 
    [sortBy]: sortOrder === 'asc' ? 1 : -1 
  };

  // Sayfalandırma Hesaplamaları (Adım 3)
  const skip = (page - 1) * perPage;
  const limit = perPage;

  // 1. Toplam öğe sayısını hesapla
  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  // 2. Verileri filtrele, sırala ve sayfalandır
  const contacts = await Contact.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec();

  // 3. Ön ve Sonraki Sayfa Kontrolleri
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  // 4. İstenen formatta yanıt verilerini döndür
  return {
    data: contacts, // Mevcut sayfadaki iletişimler dizisi
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (payload) => {
  // MongoDB'de yeni bir belge oluştur
  const newContact = await Contact.create(payload);
  return newContact;
};

export const updateContact = async (contactId, payload) => {
  // Belgeyi bulur ve günceller. Güncellenmiş belgeyi döndürür.
  const updatedContact = await Contact.findByIdAndUpdate( contactId, payload, { new: true } );
  return updatedContact;
} 


export const deleteContact = async (contactId) => {
  // Belgeyi bulur ve siler. Silinen belgeyi döndürür (null eğer bulunamazsa).
  const deletedContact = await Contact.findOneAndDelete({ _id: contactId });
  return deletedContact;
};