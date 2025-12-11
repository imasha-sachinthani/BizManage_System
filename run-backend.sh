#!/bin/bash
cd /home/chethiya/Desktop/BizManage/backend
export DATABASE_URL="postgresql://bizmanage_user:bizmanage_pass_2024@localhost:5433/bizmanage_erp"
exec npm run dev