using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using System;
using System.Linq;
using System.Net;

namespace Timesheet
{
    /// <summary>
    /// Here we create the [AjaxOnlyWebApi] attribute
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public sealed class AjaxOnlyWebApiAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            var request = actionContext.HttpContext.Request;
            var headers = request.Headers;
            StringValues requested;
            if (!actionContext.HttpContext.Request.Headers.TryGetValue("X-Requested-With", out requested) ||
                 requested.FirstOrDefault() != "XMLHttpRequest")
            {
                actionContext.Result = new JsonResult(new { HttpStatusCode.NotFound });
            }

            //base.OnActionExecuting(actionContext);
        }
    }
}