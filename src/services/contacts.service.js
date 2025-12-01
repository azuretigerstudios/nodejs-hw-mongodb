import  {Contact}  from '../db/models/contact.model.js';

export const getAllContacts = async ({ userId,
  page, 
  perPage, 
  sortBy, 
  sortOrder, 
  contactType, 
  isFavourite 
}) => {
  
  // Filtreleme Kriterlerini Oluşturma (Adım 5)
  const filter = { userId };
  
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

export const getContactById = async (_id, userId) => {
    const contact = await Contact.findOne({ _id, userId }); // <-- userId filtresi
    return contact;
}

export const createContact = async (payload) => {
  // MongoDB'de yeni bir belge oluştur
  // const newContact = await Contact.create(payload);
  // return newContact;
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (_id, userId, payload) => {
    const contact = await Contact.findOneAndUpdate({ _id, userId }, payload, { new: true }); // <-- userId filtresi
    return contact;
}


export const deleteContact = async (_id, userId) => {
    const contact = await Contact.findOneAndDelete({ _id, userId }); // <-- userId filtresi
    return contact;
}