package rest_api;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.ForbiddenException;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.PUT;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Implements a minimal RESTful API that provides access to Resource objects.
 */

@Path("/resource")
public class ResourceService {

	//** Static variables.

	//** Static initializer.

	//** Instance variables.

	//** Instance initializer.

	//** Inner classes.

	/**
	 * Resource implements a simple model object that is exposed via a RESTful
	 * API.  This type of class is typically not contained within the Service
	 * class.
	 */

	public static class Resource {

		//** Static variables.

		protected final static List<Resource> CACHE = new ArrayList<Resource>();

		//** Static initializer.

		static {
			CACHE.add(new Resource("123", "abc"));
			CACHE.add(new Resource("456", "def"));
			CACHE.add(new Resource("789", "ghi"));
		}

		//** Instance variables.

		protected String id;
		protected String value;
		protected String internalValue;

		//** Instance initializer.

		//** Inner classes.

		//** Constructors.

		protected Resource() {
			super();
			internalValue = "This is private data";
		}

		public Resource(String id, String value) {
			this();
			this.id = id;
			this.value = value;
		}

		//** Static methods.

		/**
		 * Retrieves the Resource whose id matches the specified id.
		 * <p/>
		 * @return
		 *		A Resource, if one was found, or null.
		 */

		public static Resource getResource(String id) {
			Iterator<Resource> iterator = CACHE.iterator();
			while (iterator.hasNext()) {
				Resource resource = iterator.next();
				if (resource.getId().equals(id)) {
					return (resource);
				}
			}
			return (null);
		}

		/**
		 * Creates a list of Resource objects, this data is used by the search
		 *  API.
		 * <p/>
		 * @return
		 *		A List containing several Resource objects.
		 */

		public static List<Resource> getResources() {
			return (CACHE);
		}

		//** Instance methods.

		public String getId() {
			return (id);
		}

		public String getValue() {
			return (value);
		}

		public String getInternalValue() {
			return (internalValue);
		}

		public void setId(String id) {
			this.id = id;
		}

		public void setValue(String value) {
			this.value = value;
		}

		public void setInternalValue(String value) {
			this.internalValue = value;
		}

		public String toString() {
			return (this.getClass().getName() + ": id=" + id + ", value=" + value + ", internalValue=" + internalValue);
		}

	}

	/**
	 * Implements a proxy for the Resource class.  This proxy is used to control
	 * the visibility of attributes contained within a Resource.
	 */

	@XmlRootElement
	public static class ResourceProxy {

		//** Static variables.

		//** Static initializer.

		//** Instance variables.

		public String id;
		public String value;

		//** Instance initializer.

		//** Inner classes.

		//** Constructors.

		/**
		 * The default constructor.
		 * <p/>
		 * @return
		 *		A new instance of ResourceProxy.
		 */

		public ResourceProxy() {
			super();
		}

		//** Static methods.

		/**
		 * Creates a new ResourceProxy based on the specified Resource.
		 * <p/>
		 * @return
		 *		A ResourceProxy which contains the state of the specified Resource.
		 */

		public static ResourceProxy create(Resource resource) {
			ResourceProxy resourceProxy = new ResourceProxy();
			resourceProxy.id = resource.getId();
			resourceProxy.value = resource.getValue();
			return (resourceProxy);
		}

		//** Instance methods.

	}

	//** Constructors.

	/**
	 * The default constructor.
	 * <p/>
	 * @return
	 *		A new instance of ResourceService.
	 */

	public ResourceService() {
		super();
	}

	//** Static methods.

	//** Instance methods.

	/**
	 * Adds a new Resource to the cache.
	 * <p/>
	 * The API may be tested via the following command:
	 * <pre>
	 * curl -v -X POST -H "Content-Type: application/json" http://localhost:9000/resource -d '{"id":"999","value":"000"}'
	 * </pre>
	 * <p/>
	 * @return
	 *		A ResourceProxy describing the Resource that was added to the cache.
	 */

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public ResourceProxy create(ResourceProxy resourceProxy) {
		String id = resourceProxy.id;
		Resource resource = Resource.getResource(id);
		if (resource == null) {
			resource = new Resource(resourceProxy.id, resourceProxy.value);
			Resource.getResources().add(resource);
			return (ResourceProxy.create(resource));
		}
		throw new ForbiddenException();
	}

	/**
	 * Removes an existing Resource from the cache.
	 * <p/>
	 * The API may be tested via the following command:
	 * <pre>
	 * curl -v -X DELETE http://localhost:9000/resource/999
	 * </pre>
	 * <p/>
	 * @return
	 *		A ResourceProxy describing the Resource that was removed from the
	 * 	cache.
	 */

	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public ResourceProxy delete(@PathParam("id") String id) {
		Resource resource = Resource.getResource(id);
		if (resource != null) {
			Resource.getResources().remove(resource);
			return (ResourceProxy.create(resource));
		}
		throw new NotFoundException();
	}

	/**
	 * Retrieves an existing Resource from the cache.
	 * <p/>
	 * The API may be tested via the following command:
	 * <pre>
	 * curl http://localhost:9000/resource/999
	 * </pre>
	 * <p/>
	 * @return
	 *		A ResourceProxy describing the Resource that was retrieved from the
	 * 	cache.
	 */

	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public ResourceProxy read(@PathParam("id") String id) {
		Resource resource = Resource.getResource(id);
		if (resource != null) {
			return (ResourceProxy.create(resource));
		}
		throw new NotFoundException();
	}

	/**
	 * Retrieves some or all of the Resource objects stored in the cache.
	 * <p/>
	 * The API may be tested via the following command:
	 * <pre>
	 * curl http://localhost:9000/resource
	 * curl "http://localhost:9000/resource?regex=%5B0-9%5D*"
	 * </pre>
	 * <p/>
	 * @return
	 *		An array of ResourceProxy objects describing the Resource objects in
	 * 	the cache that matched the selection criteria.
	 */

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public ResourceProxy[] search(@QueryParam("regex") String regex) {
		List<ResourceProxy> list = new ArrayList<ResourceProxy>();
		Iterator<Resource> iterator = Resource.getResources().iterator();
		Pattern pattern = regex != null ? Pattern.compile(regex) : null;
		while (iterator.hasNext()) {
			Resource resource = iterator.next();
			if (pattern == null || pattern.matcher(resource.getValue()).matches()) {
				list.add(ResourceProxy.create(resource));
			}
		}
		return (list.toArray(new ResourceProxy[list.size()]));
	}

	/**
	 * Updates an existing Resource in the cache.
	 * <p/>
	 * The API may be tested via the following command:
	 * <pre>
	 * curl -X PUT -H "Content-Type: application/json" http://localhost:9000/resource -d '{"id":"123","value":"xxx"}'
	 * </pre>
	 * <p/>
	 * @return
	 *		A ResourceProxy describing the cached Resource that was updated.
	 */

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public ResourceProxy update(ResourceProxy resourceProxy) {
		String id = resourceProxy.id;
		Resource resource = Resource.getResource(id);
		if (resource != null) {
			resource.setValue(resourceProxy.value);
			return (ResourceProxy.create(resource));
		}
		throw new NotFoundException();
	}

}

