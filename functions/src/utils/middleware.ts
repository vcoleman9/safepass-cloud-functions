import { Request, Response, NextFunction } from "express"

const tokenExtractor = (request: Request, _response: Response, next: NextFunction): void => {
  const authorization = request.get('authorization')
  request.token = authorization && authorization.toLowerCase().startsWith('bearer ')
    ? authorization.substring(7)
    : null
  next()
}

// const extractIds = (request: Request, _response: Response, next: NextFunction) => {
//   const districtId = request.params.districtId
//   const schoolId = request.params.schoolId
//   request.districtPath = districtId ? `districts/${districtId}` : null
//   request.schoolPath = districtId && schoolId ? `districts/${districtId}/schools/${schoolId}` : null
//   next()
// }

export default {
  // extractIds,
  tokenExtractor
}