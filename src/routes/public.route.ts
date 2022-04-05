import express from 'express';

const router = express.Router();

router.get('/list1', (req, res)=>{
  res.send('LIST 1 IS ACCESSED');
});


export default router;
