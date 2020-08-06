import { Request, Response, NextFunction } from "express"

// currently only applies to district and school
const formatDocumentPaths = ({ body }: Request, _response: Response, next: NextFunction) => {
  const district: string | undefined = body.district
  const school: string | undefined = body.school
  if (district) {
    if (!district.startsWith('districts/')) {
      body.district = `districts/${body.district}`
    }
    if (school && !school.startsWith('districts/')) {
      body.school = `${body.districts}schools/${body.school}`
    }
  }
  next()
}

export default {
  formatDocumentPaths
}