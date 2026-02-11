import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getContactById=async(req,res)=>
{
    try {
        const contact=await Contact.findById(req.params.id);
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};
